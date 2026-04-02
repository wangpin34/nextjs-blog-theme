import Link from 'next/link';

export default function Header({ name, pathname = '' }) {
  const isPosts = pathname === '/posts' || pathname.startsWith('/posts/');
  const isAbout = pathname === '/about';

  return (
    <header className="pt-20 pb-12">
      <div className="w-12 h-12 rounded-full block mx-auto mb-4 bg-gradient-conic from-gradient-3 to-gradient-4" />
      <p className="text-2xl dark:text-white text-center">
        <Link href="/about">{name}</Link>
      </p>
      <nav className="mt-6 flex items-center justify-center gap-6 uppercase text-sm tracking-widest">
        <Link
          href="/posts"
          className={
            isPosts
              ? 'text-pink-500 dark:text-pink-500'
              : 'text-gray-600 dark:text-gray-300'
          }
        >
          posts
        </Link>
        <Link
          href="/about"
          className={
            isAbout
              ? 'text-pink-500 dark:text-pink-500'
              : 'text-gray-600 dark:text-gray-300'
          }
        >
          about
        </Link>
      </nav>
    </header>
  );
}
