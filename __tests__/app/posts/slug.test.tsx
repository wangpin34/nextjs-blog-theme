import { render, screen } from '@testing-library/react';

import PostPage, {
  generateMetadata,
  generateStaticParams,
} from '../../../src/app/posts/[slug]/page';

const mockNotFound = jest.fn();
jest.mock('next/navigation', () => ({
  __esModule: true,
  notFound: () => mockNotFound(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <div data-testid="image" {...props} />;
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

jest.mock('../../../src/components/Layout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
  GradientBackground: () => null,
}));

jest.mock('../../../src/components/Header', () => ({
  __esModule: true,
  default: ({ name }: any) => <div data-testid="header">{name}</div>,
}));

jest.mock('../../../src/components/Footer', () => ({
  __esModule: true,
  default: ({ copyrightText }: any) => (
    <div data-testid="footer">{copyrightText}</div>
  ),
}));

jest.mock('../../../src/components/ArrowIcon', () => ({
  __esModule: true,
  default: () => <span aria-hidden="true" />,
}));

jest.mock('../../../src/components/CustomLink', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('../../../src/components/PostContentClient', () => ({
  __esModule: true,
  default: ({ slug }: any) => <div data-testid="mdx-content">{slug}</div>,
}));

const mockGetGlobalData = jest.fn();
jest.mock('../../../src/utils/global-data', () => ({
  __esModule: true,
  getGlobalData: () => mockGetGlobalData(),
}));

const mockGetPosts = jest.fn();
jest.mock('../../../src/utils/mdx-utils', () => ({
  __esModule: true,
  getPosts: () => mockGetPosts(),
}));

describe('app/posts/[slug]/page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetGlobalData.mockReturnValue({ name: 'Blog', footerText: 'Footer' });
    mockGetPosts.mockReturnValue([
      { filePath: 'n.mdx', data: { title: 'N' } },
      { filePath: 'my-slug.mdx', data: { title: 'T', description: 'D' } },
      { filePath: 'p.mdx', data: { title: 'P' } },
      { filePath: 'hello.mdx', data: { title: 'Hello' } },
      { filePath: 'world.mdx', data: { title: 'World' } },
    ]);
  });

  test('renders post content and prev/next links', () => {
    render(<PostPage params={{ slug: 'my-slug' }} />);

    expect(screen.getByRole('heading', { name: 'T' })).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /P/i })).toHaveAttribute(
      'href',
      '/posts/p',
    );
    expect(screen.getByRole('link', { name: /N/i })).toHaveAttribute(
      'href',
      '/posts/n',
    );
  });

  test('generateStaticParams maps post slugs to params', () => {
    expect(generateStaticParams()).toEqual([
      { slug: 'n' },
      { slug: 'my-slug' },
      { slug: 'p' },
      { slug: 'hello' },
      { slug: 'world' },
    ]);
  });

  test('generateMetadata returns title and description for slug', () => {
    const metadata = generateMetadata({ params: { slug: 'my-slug' } });

    expect(metadata).toMatchObject({
      title: 'T - Blog',
      description: 'D',
    });
  });

  test('calls notFound for unknown slug', () => {
    render(<PostPage params={{ slug: 'missing' }} />);
    expect(mockNotFound).toHaveBeenCalled();
  });
});
