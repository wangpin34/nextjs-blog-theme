import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const OUT_DIR = path.join(ROOT, 'src', 'generated', 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');

function isPostFile(fileName) {
  return /\.mdx?$/.test(fileName);
}

function slugFromFileName(fileName) {
  return fileName.replace(/\.mdx?$/, '');
}

function quote(value) {
  return JSON.stringify(value);
}

function sanitizeFrontMatter(data) {
  return JSON.stringify(data ?? {}, null, 2);
}

function toDateValue(value) {
  const date = new Date(value ?? '');
  return Number.isNaN(date.valueOf()) ? -Infinity : date.valueOf();
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function clearGeneratedMdxFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  for (const fileName of fs.readdirSync(dirPath)) {
    if (/\.mdx?$/.test(fileName)) {
      fs.rmSync(path.join(dirPath, fileName));
    }
  }
}

function toImportPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function getPublicRelativeDir(outputFilePath) {
  return toImportPath(path.relative(path.dirname(outputFilePath), PUBLIC_DIR));
}

function createImageImportContext(publicRelativeDir) {
  const imports = new Map();

  return {
    register(src) {
      if (!imports.has(src)) {
        imports.set(src, {
          identifier: `__postImage${imports.size}`,
          importPath: `${publicRelativeDir}${src}`,
        });
      }

      return imports.get(src);
    },
    toImportBlock() {
      if (imports.size === 0) return '';

      const importLines = Array.from(imports.values()).map(
        ({ identifier, importPath }) =>
          `import ${identifier} from '${importPath}';`,
      );

      return `${importLines.join('\n')}\nimport Image from 'next/image';\n\n`;
    },
  };
}

function rewriteAbsoluteMarkdownImages(content, imageContext) {
  return content.replace(
    /!\[([^\]]*)\]\((\/[^\s)"']+)(\s+(?:"([^"]*)"|'([^']*)'))?\)/g,
    (
      _,
      alt,
      src,
      _titleGroup = '',
      doubleQuotedTitle = '',
      singleQuotedTitle = '',
    ) => {
      const { identifier } = imageContext.register(src);
      const title = doubleQuotedTitle || singleQuotedTitle;
      const titleProp = title ? ` title={${JSON.stringify(title)}}` : '';

      return `<Image src={${identifier}} alt=${JSON.stringify(alt)}${titleProp} />`;
    },
  );
}

function rewriteAbsoluteJsxImagePaths(content, imageContext) {
  const quotedSrcPattern = /<(img|Image)\b([^>]*?)\ssrc=(['"])(\/[^'"]+)\3/g;
  const expressionSrcPattern =
    /<(img|Image)\b([^>]*?)\ssrc=\{(['"])(\/[^'"]+)\3\}/g;

  return content
    .replace(
      quotedSrcPattern,
      (_, tagName, beforeSrc, _quoteCharacter, src) => {
        const { identifier } = imageContext.register(src);
        return `<Image${beforeSrc} src={${identifier}}`;
      },
    )
    .replace(
      expressionSrcPattern,
      (_, tagName, beforeSrc, _quoteCharacter, src) => {
        const { identifier } = imageContext.register(src);
        return `<Image${beforeSrc} src={${identifier}}`;
      },
    );
}

function rewriteAbsoluteImagePaths(content, outputFilePath) {
  const publicRelativeDir = getPublicRelativeDir(outputFilePath);
  const imageContext = createImageImportContext(publicRelativeDir);
  const fencedBlockPattern = /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
  let rewritten = '';
  let lastIndex = 0;

  for (const match of content.matchAll(fencedBlockPattern)) {
    const startIndex = match.index ?? 0;
    const endIndex = startIndex + match[0].length;
    const contentBeforeFence = content.slice(lastIndex, startIndex);

    rewritten += rewriteAbsoluteJsxImagePaths(
      rewriteAbsoluteMarkdownImages(contentBeforeFence, imageContext),
      imageContext,
    );
    rewritten += match[0];
    lastIndex = endIndex;
  }

  const remainingContent = content.slice(lastIndex);
  rewritten += rewriteAbsoluteJsxImagePaths(
    rewriteAbsoluteMarkdownImages(remainingContent, imageContext),
    imageContext,
  );

  return `${imageContext.toImportBlock()}${rewritten}`;
}

function main() {
  ensureDirectory(OUT_DIR);
  clearGeneratedMdxFiles(OUT_DIR);

  const fileNames = fs.readdirSync(POSTS_DIR).filter(isPostFile).sort();
  const posts = [];

  for (const fileName of fileNames) {
    const slug = slugFromFileName(fileName);
    const source = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8');
    const { content, data } = matter(source);
    const outputFilePath = path.join(OUT_DIR, `${slug}.mdx`);
    const rewrittenContent = rewriteAbsoluteImagePaths(content, outputFilePath);

    const outputMdx = `\nexport const frontMatter = ${sanitizeFrontMatter(data)};\n\n${rewrittenContent.trim()}\n`;
    fs.writeFileSync(outputFilePath, outputMdx);

    posts.push({
      slug,
      fileName,
      frontMatter: data,
      sortDate: toDateValue(data?.date),
    });
  }

  posts.sort((a, b) => b.sortDate - a.sortDate);

  const importLines = posts
    .map(
      ({ slug }, index) =>
        `import Post${index}, { frontMatter as frontMatter${index} } from './${slug}.mdx';`,
    )
    .join('\n');

  const recordLines = posts
    .map(
      ({ slug }, index) =>
        `  ${quote(slug)}: { slug: ${quote(slug)}, frontMatter: frontMatter${index} as PostFrontMatter, Component: Post${index} },`,
    )
    .join('\n');

  const indexContent = `${importLines}\nimport type { ComponentType } from 'react';\n\nexport type PostFrontMatter = {\n  title?: string;\n  description?: string;\n  date?: string;\n  [key: string]: unknown;\n};\n\nexport type PostRecord = {\n  slug: string;\n  frontMatter: PostFrontMatter;\n  Component: ComponentType;\n};\n\nexport const postsBySlug: Record<string, PostRecord> = {\n${recordLines}\n};\n\nexport const postSlugs = Object.keys(postsBySlug);\n\nexport const orderedPosts = Object.values(postsBySlug).sort((a, b) => {\n  const aDate = new Date(String(a.frontMatter.date ?? ''));\n  const bDate = new Date(String(b.frontMatter.date ?? ''));\n  const aValue = Number.isNaN(aDate.valueOf()) ? -Infinity : aDate.valueOf();\n  const bValue = Number.isNaN(bDate.valueOf()) ? -Infinity : bDate.valueOf();\n  return bValue - aValue;\n});\n`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexContent);
  console.log(`Generated ${posts.length} post modules.`);
}

main();
