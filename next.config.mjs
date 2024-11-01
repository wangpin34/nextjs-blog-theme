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

export default config;
