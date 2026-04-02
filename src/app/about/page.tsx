import SEO from 'components/SEO';
import { getGlobalData } from 'utils/global-data';

export default function AboutPage() {
  const globalData = getGlobalData();
  return (
    <>
      <SEO
        title={`About - ${globalData.name}`}
        description={`Learn more about ${globalData.name}`}
      />
      <main className="w-full max-w-full px-6 md:px-0 selection:bg-pink-300 selection:text-slate-600">
        <article className="prose dark:prose-dark mx-auto">
          <h1>About</h1>
          <p>
            This is a personal space where I share notes on development,
            testing, and things I am learning.
          </p>
          <p>
            The blog is built with Next.js and MDX so content and components can
            live together naturally.
          </p>
          <p>Thanks for reading.</p>
        </article>
      </main>
    </>
  );
}
