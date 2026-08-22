import { PROFILE } from '@/content/site';

export function Stuff() {
  return (
    <section id="stuff" className="scroll-mt-16 mb-10">
      <h2 className="text-heading text-lg font-bold mb-4">Stuff</h2>
      <div className="text-xs space-y-1.5">
        <p>
          <span className="text-heading font-semibold">Email:</span>{' '}
          <a href={`mailto:${PROFILE.email}`} className="text-amber hover:underline">
            {PROFILE.email}
          </a>
        </p>
        <p>
          <span className="text-heading font-semibold">GitHub:</span>{' '}
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
            github.com/anubhav-qt
          </a>
        </p>
        <p>
          <span className="text-heading font-semibold">LinkedIn:</span>{' '}
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
            linkedin.com/in/anubhav-qt
          </a>
        </p>
        <p>
          <span className="text-heading font-semibold">Based in:</span> {PROFILE.location}
        </p>
      </div>
    </section>
  );
}
