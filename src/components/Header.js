import Link from 'next/link';
import BlogNavLink from './BlogNavLink';

export default function Header({ name }) {
  return (
    <header className="pt-20 pb-12">
      <div className="w-12 h-12 rounded-full block mx-auto mb-4 bg-gradient-conic from-gradient-3 to-gradient-4" />
      <p className="text-2xl dark:text-white text-center">
        <Link href="/about">{name}</Link>
      </p>
      <nav className="mt-6 flex items-center justify-center gap-6 uppercase text-sm tracking-widest">
        <BlogNavLink href="/">Home</BlogNavLink>
        <BlogNavLink href="/posts">Posts</BlogNavLink>
        <BlogNavLink href="/about">About</BlogNavLink>
      </nav>
    </header>
  );
}
