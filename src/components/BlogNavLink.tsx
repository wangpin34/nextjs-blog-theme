'use client';

import classnames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// This *client* component will be imported into a blog layout
export default function BlogNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  // Navigating to `/blog/hello-world` will return 'hello-world'
  // for the selected layout segment
  const pathname = usePathname();
  const isActive =
    pathname.endsWith(href) || (href.includes(pathname) && pathname !== '/');

  return (
    <Link
      href={href}
      // Change style depending on whether the link is active
      className={classnames({
        'text-pink-500 dark:text-pink-500': isActive,
        'text-gray-600 dark:text-gray-300': !isActive,
      })}
    >
      {children}
    </Link>
  );
}
