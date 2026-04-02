'use client';

import { MDXProvider } from '@mdx-js/react';
import classnames from 'classnames';
import CustomLink from './CustomLink';
import { H1, H2, H3, H4, H5, H6 } from './HeadLine';
import { postsBySlug } from '../generated/posts';

type MDXComponents = Record<string, any>;

const components: MDXComponents = {
  a: CustomLink,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
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

type PostContentClientProps = {
  slug: string;
};

export default function PostContentClient({ slug }: PostContentClientProps) {
  const post = postsBySlug[slug];

  if (!post) {
    return null;
  }

  const PostContent = post.Component as any;

  return (
    <MDXProvider components={components}>
      <PostContent />
    </MDXProvider>
  );
}
