import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
      <p className="text-lg mb-6">
        This is a simple blog built with Next.js and MDX. You can write your
        posts in Markdown and include React components in your content.
      </p>
      <p className="text-lg">
        Check out the <Link href="/posts">posts</Link> page to see all the
        articles.
      </p>
    </main>
  );
}
