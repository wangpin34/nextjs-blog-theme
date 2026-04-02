# Penn's Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/c15ef74c-cefe-4230-8ddb-4a49394d35ed/deploy-status)](https://app.netlify.com/sites/penn-wang/deploys)

## Getting started

### Preview static export locally

This command load the config for static export and gen assets into `out` directory.

```
pnpm build_static
```

After it's done, use [serve](https://www.npmjs.com/package/serve) powered. by `vercel` to start a local http server. e.g.

```
npx serve -p 3000 out
```

Note: Don't use [http-server](https://www.npmjs.com/package/http-server) unless you like `trailingSlash` which you can enable in the [config](https://nextjs.org/docs/app/guides/static-exports#configuration) of NextJS.

> When http-server receives requests like /posts/my-dev, it finds the directory first, issues a 302 redirect to /posts/my-dev/, then looks for index.html inside it — which doesn't exist → 404.
