import ArrowIcon from 'components/ArrowIcon';
import Link from 'next/link';
import { getGlobalData } from 'utils/global-data';
import { getPosts } from 'utils/mdx-utils';
export default function Home() {
  const globalData = getGlobalData();
  const posts = getPosts();
  return (
    <>
      <main className="container">
        <h1 className="text-3xl lg:text-5xl text-center mb-12">最新文章</h1>
        <ul className="w-full">
          {posts.slice(0, 3).map((post) => {
            const slug = post.filePath.replace(/\.mdx?$/, '');

            return (
              <li
                key={post.filePath}
                className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0"
              >
                <Link
                  href={`/posts/${slug}`}
                  className="py-6 lg:py-10 px-6 lg:px-16 block focus:outline-none focus:ring-4"
                >
                  {post.data.date && (
                    <p className="uppercase mb-3 font-bold opacity-60">
                      {String(post.data.date)}
                    </p>
                  )}
                  <h2 className="text-2xl md:text-3xl">
                    {String(post.data.title ?? slug)}
                  </h2>
                  {post.data.description && (
                    <p className="mt-3 text-lg opacity-60">
                      {String(post.data.description)}
                    </p>
                  )}
                  <ArrowIcon className="mt-4" />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/posts"
          className="mt-6 block text-center text-lg font-semibold text-pink-500 dark:text-pink-500"
        >
          查看所有文章
        </Link>
      </main>
    </>
  );
}
