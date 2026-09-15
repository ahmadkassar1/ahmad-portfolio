export function Arrow({ direction = 'diagonal' }: { direction?: 'diagonal' | 'down' }) {
  return (
    <svg className={`arrow arrow-${direction}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
