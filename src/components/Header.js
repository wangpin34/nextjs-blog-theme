import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header({ name }) {
  const { pathname } = useRouter();
  const isPosts = pathname === '/posts' || pathname.startsWith('/posts/');
  const isAbout = pathname === '/about';

  return (
    <header className="pt-20 pb-12">
      <div className="w-12 h-12 rounded-full block mx-auto mb-4 bg-gradient-conic from-gradient-3 to-gradient-4" />
      <p className="text-2xl dark:text-white text-center">
        <Link href="/posts" passHref legacyBehavior>
          <a>{name}</a>
        </Link>
      </p>
      <nav className="mt-6 flex items-center justify-center gap-6 uppercase text-sm tracking-widest">
        <Link href="/posts" passHref legacyBehavior>
          <a
            className={
              isPosts
                ? 'text-pink-500 dark:text-pink-500'
                : 'text-gray-600 dark:text-gray-300'
            }
          >
            posts
          </a>
        </Link>
        <Link href="/about" passHref legacyBehavior>
          <a
            className={
              isAbout
                ? 'text-pink-500 dark:text-pink-500'
                : 'text-gray-600 dark:text-gray-300'
            }
          >
            about
          </a>
        </Link>
      </nav>
    </header>
  );
}
