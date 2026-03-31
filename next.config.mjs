import createMDX from '@next/mdx';

const staticConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

const ssrConfig = {
  images: {
    minimumCacheTTL: 60 * 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

const config = process.env.ENV === 'static' ? staticConfig : ssrConfig;

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ['remark-mdx-images'],
    rehypePlugins: ['@mapbox/rehype-prism'],
  },
});

export default withMDX({
  ...config,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});
