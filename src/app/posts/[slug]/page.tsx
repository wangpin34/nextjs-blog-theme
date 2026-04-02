import ArrowIcon from 'components/ArrowIcon';
import PostContentClient from 'components/PostContentClient';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGlobalData } from 'utils/global-data';
import { getPosts } from 'utils/mdx-utils';

type Params = {
  slug: string;
};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getPosts().map((post) => ({
    slug: post.filePath.replace(/\.mdx?$/, ''),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const globalData = getGlobalData();
  const posts = getPosts();
  const { slug } = await params;
  const currentPost = posts.find(
    (post) => post.filePath.replace(/\.mdx?$/, '') === slug,
  );
  const title = String(currentPost?.data?.title ?? slug);
  const description = String(currentPost?.data?.description ?? '');

  return {
    title: `${title} - ${globalData.name}`,
    description,
    openGraph: {
      title: `${title} - ${globalData.name}`,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const globalData = getGlobalData();
  const { slug } = await params;
  const posts = getPosts();
  const currentPostIndex = posts.findIndex(
    (post) => post.filePath.replace(/\.mdx?$/, '') === slug,
  );
  const currentPost = currentPostIndex >= 0 ? posts[currentPostIndex] : null;

  if (!currentPost) {
    notFound();
    return null;
  }

  const prevEntry = currentPostIndex >= 0 ? posts[currentPostIndex + 1] : null;
  const nextEntry = currentPostIndex >= 0 ? posts[currentPostIndex - 1] : null;

  const prevPost = prevEntry
    ? {
        title: String(prevEntry.data.title ?? prevEntry.filePath),
        slug: prevEntry.filePath.replace(/\.mdx?$/, ''),
      }
    : null;
  const nextPost = nextEntry
    ? {
        title: String(nextEntry.data.title ?? nextEntry.filePath),
        slug: nextEntry.filePath.replace(/\.mdx?$/, ''),
      }
    : null;

  return (
    <article className="w-full max-w-full px-6 md:px-0 selection:bg-pink-300 selection:text-slate-600">
      <header>
        <h1 className="text-3xl md:text-5xl dark:text-white text-center mb-12">
          {String(currentPost.data.title ?? slug)}
        </h1>
        {currentPost.data.description && (
          <p className="text-xl mb-4">{String(currentPost.data.description)}</p>
        )}
      </header>
      <main>
        <div className="prose dark:prose-dark">
          <PostContentClient slug={slug} />
        </div>
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
  );
}
