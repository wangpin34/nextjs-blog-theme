export function H1({ children }) {
  return (
    <h1 className="mt-20">
      <a
        href={`#${children}`}
        id={String(children)}
        className="text-4xl font-semibold text-pink-600 no-underline dark:text-pink-600"
      >
        {children}
      </a>
    </h1>
  );
}

export function H2({ children }) {
  return (
    <h2>
      <a
        href={`#${children}`}
        id={String(children)}
        className="text-4xl font-light text-pink-600  no-underline dark:text-pink-600"
      >
        {children}
      </a>
    </h2>
  );
}

export function H3({ children }) {
  return (
    <h3>
      <a
        href={`#${children}`}
        id={String(children)}
        className="text-3xl font-light text-pink-600  no-underline dark:text-pink-600"
      >
        {children}
      </a>
    </h3>
  );
}

export function H4({ children }) {
  return (
    <h4>
      <a
        href={`#${children}`}
        id={String(children)}
        className="text-2xl font-light text-pink-600 no-underline dark:text-pink-600"
      >
        {children}
      </a>
    </h4>
  );
}

export function H5({ children }) {
  return (
    <h5>
      <a
        href={`#${children}`}
        id={String(children)}
        className="text-xl font-semibold text-pink-600 no-underline dark:text-pink-600"
      >
        {children}
      </a>
    </h5>
  );
}

export function H6({ children }) {
  return (
    <h6>
      <a
        href={`#${children}`}
        id={String(children)}
        className="text-lg font-semibold text-pink-600 no-underline dark:text-pink-600"
      >
        {children}
      </a>
    </h6>
  );
}
