import { MDXProvider } from '@mdx-js/react';
import classnames from 'classnames';
import Link from 'next/link';
import ArrowIcon from '../../components/ArrowIcon';
import CustomLink from '../../components/CustomLink';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { H1, H2, H3, H4, H5, H6 } from '../../components/HeadLine';
import Layout, { GradientBackground } from '../../components/Layout';
import SEO from '../../components/SEO';
import { orderedPosts, postSlugs, postsBySlug } from '../../generated/posts';
import { getGlobalData } from '../../utils/global-data';

type MDXComponents = Record<string, any>;

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components: MDXComponents = {
  a: CustomLink,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  // Head,
  code: ({ children, className, ...rest }) =>
    className?.startsWith('language-') ? (
      <code className={className} {...rest}>
        {children}
      </code>
    ) : (
      <code
        className={classnames(
          className,
          'p-1 mx-1 text-pink-600 bg-slate-100 rounded-md dark:text-pink-600 dark:bg-slate-800',
        )}
        {...rest}
      >
        {children}
      </code>
    ),
};

export default function PostPage({
  slug,
  frontMatter,
  prevPost,
  nextPost,
  globalData,
}) {
  const post = postsBySlug[slug];
  const PostContent = post?.Component;

  return (
    <Layout>
      <SEO
        title={`${frontMatter.title} - ${globalData.name}`}
        description={frontMatter.description}
      />
      <Header name={globalData.name} />
      <article className="w-full max-w-full px-6 md:px-0 selection:bg-pink-300 selection:text-slate-600">
        <header>
          <h1 className="text-3xl md:text-5xl dark:text-white text-center mb-12">
            {frontMatter.title}
          </h1>
          {frontMatter.description && (
            <p className="text-xl mb-4">{frontMatter.description}</p>
          )}
        </header>
        <main>
          <article className="prose dark:prose-dark">
            {PostContent ? (
              <MDXProvider components={components}>
                <PostContent />
              </MDXProvider>
            ) : null}
          </article>
        </main>
        <div className="grid md:grid-cols-2 lg:-mx-24 mt-12">
          {prevPost && (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="py-8 px-10 text-center md:text-right first:rounded-t-lg md:first:rounded-tr-none md:first:rounded-l-lg last:rounded-r-lg first last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 last:border-t md:border-r-0 md:last:border-r md:last:rounded-r-none flex flex-col"
            >
              <p className="uppercase text-gray-500 mb-4 dark:text-white dark:opacity-60">
                Previous
              </p>
              <h4 className="text-2xl text-gray-700 mb-6 dark:text-white">
                {prevPost.title}
              </h4>
              <ArrowIcon className="transform rotate-180 mx-auto md:mr-0 mt-auto" />
            </Link>
          )}
          {nextPost && (
            <Link
              href={`/posts/${nextPost.slug}`}
              className="py-8 px-10 text-center md:text-left md:first:rounded-t-lg last:rounded-b-lg first:rounded-l-lg md:last:rounded-bl-none md:last:rounded-r-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-t-0 first:border-t first:rounded-t-lg md:border-t border-b-0 last:border-b flex flex-col"
            >
              <p className="uppercase text-gray-500 mb-4 dark:text-white dark:opacity-60">
                Next
              </p>
              <h4 className="text-2xl text-gray-700 mb-6 dark:text-white">
                {nextPost.title}
              </h4>
              <ArrowIcon className="mt-auto mx-auto md:ml-0" />
            </Link>
          )}
        </div>
      </article>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="absolute -top-32 opacity-30 dark:opacity-50"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const slug = params.slug;
  const globalData = getGlobalData();

  const currentPost = postsBySlug[slug];
  const currentPostIndex = orderedPosts.findIndex((post) => post.slug === slug);
  const prevEntry =
    currentPostIndex >= 0 ? orderedPosts[currentPostIndex + 1] : null;
  const nextEntry =
    currentPostIndex >= 0 ? orderedPosts[currentPostIndex - 1] : null;

  const prevPost = prevEntry
    ? {
        title: String(prevEntry.frontMatter.title ?? prevEntry.slug),
        slug: prevEntry.slug,
      }
    : null;
  const nextPost = nextEntry
    ? {
        title: String(nextEntry.frontMatter.title ?? nextEntry.slug),
        slug: nextEntry.slug,
      }
    : null;

  return {
    props: {
      globalData,
      slug,
      frontMatter: currentPost?.frontMatter ?? {},
      prevPost,
      nextPost,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = postSlugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
