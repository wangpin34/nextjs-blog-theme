import Link from 'next/link';
import { ComponentProps } from 'react';
export default function CustomLink({
  href,
  children,
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      href={href}
      className="px-1 text-pink-500 dark:text-pink-500"
    >
      {children}
    </Link>
  );
}
