declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const frontMatter: Record<string, unknown>;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
