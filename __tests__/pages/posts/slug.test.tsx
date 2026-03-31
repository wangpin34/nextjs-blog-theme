import { render, screen } from '@testing-library/react';

import PostPage, {
  getStaticPaths,
  getStaticProps,
} from '../../../pages/posts/[slug]';

jest.mock('@mdx-js/react', () => ({
  __esModule: true,
  MDXProvider: ({ children }: any) => <>{children}</>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt} {...props} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('../../../components/Layout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
  GradientBackground: () => null,
}));

jest.mock('../../../components/SEO', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../../components/Header', () => ({
  __esModule: true,
  default: ({ name }: any) => <div data-testid="header">{name}</div>,
}));

jest.mock('../../../components/Footer', () => ({
  __esModule: true,
  default: ({ copyrightText }: any) => (
    <div data-testid="footer">{copyrightText}</div>
  ),
}));

jest.mock('../../../components/ArrowIcon', () => ({
  __esModule: true,
  default: () => <span aria-hidden="true" />,
}));

jest.mock('../../../components/CustomLink', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('../../../components/HeadLine', () => ({
  __esModule: true,
  H1: ({ children }: any) => <h1>{children}</h1>,
  H2: ({ children }: any) => <h2>{children}</h2>,
  H3: ({ children }: any) => <h3>{children}</h3>,
  H4: ({ children }: any) => <h4>{children}</h4>,
  H5: ({ children }: any) => <h5>{children}</h5>,
  H6: ({ children }: any) => <h6>{children}</h6>,
}));

const mockGetGlobalData = jest.fn();
jest.mock('../../../utils/global-data', () => ({
  __esModule: true,
  getGlobalData: () => mockGetGlobalData(),
}));

jest.mock('../../../generated/posts', () => ({
  __esModule: true,
  postsBySlug: {
    'my-slug': {
      slug: 'my-slug',
      frontMatter: { title: 'T', description: 'D' },
      Component: () => <div data-testid="mdx-content">Body</div>,
    },
    p: {
      slug: 'p',
      frontMatter: { title: 'P' },
      Component: () => <div />,
    },
    n: {
      slug: 'n',
      frontMatter: { title: 'N' },
      Component: () => <div />,
    },
    hello: {
      slug: 'hello',
      frontMatter: { title: 'Hello' },
      Component: () => <div />,
    },
    world: {
      slug: 'world',
      frontMatter: { title: 'World' },
      Component: () => <div />,
    },
  },
  postSlugs: ['hello', 'world'],
  orderedPosts: [
    { slug: 'n', frontMatter: { title: 'N' }, Component: () => <div /> },
    {
      slug: 'my-slug',
      frontMatter: { title: 'T', description: 'D' },
      Component: () => <div data-testid="mdx-content">Body</div>,
    },
    { slug: 'p', frontMatter: { title: 'P' }, Component: () => <div /> },
  ],
}));

describe('pages/posts/[slug]', () => {
  test('renders title/description and prev/next links', () => {
    render(
      <PostPage
        slug="my-slug"
        frontMatter={{ title: 'My Post', description: 'Post desc' }}
        prevPost={{ slug: 'prev', title: 'Prev Post' }}
        nextPost={{ slug: 'next', title: 'Next Post' }}
        globalData={{ name: 'Blog Name', footerText: '© Footer' }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'My Post' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Post desc')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Prev Post/i })).toHaveAttribute(
      'href',
      '/posts/prev',
    );
    expect(screen.getByRole('link', { name: /Next Post/i })).toHaveAttribute(
      'href',
      '/posts/next',
    );
  });

  test('getStaticPaths maps postFilePaths into params', async () => {
    const res = await getStaticPaths();
    expect(res).toEqual({
      paths: [{ params: { slug: 'hello' } }, { params: { slug: 'world' } }],
      fallback: false,
    });
  });

  test('getStaticProps returns props for slug', async () => {
    mockGetGlobalData.mockReturnValue({ name: 'Blog', footerText: 'Footer' });

    const res = await getStaticProps({ params: { slug: 'my-slug' } } as any);

    expect(res).toEqual({
      props: {
        globalData: { name: 'Blog', footerText: 'Footer' },
        slug: 'my-slug',
        frontMatter: { title: 'T', description: 'D' },
        prevPost: { slug: 'p', title: 'P' },
        nextPost: { slug: 'n', title: 'N' },
      },
    });
  });
});
