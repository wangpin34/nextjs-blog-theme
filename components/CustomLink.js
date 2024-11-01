import Link from 'next/link';

export default function CustomLink({ as, href, ...otherProps }) {
  return (
    <>
      <Link as={as} href={href} passHref legacyBehavior>
        <a {...otherProps} data-href={href} className="text-pink-500" />
      </Link>
    </>
  );
}
