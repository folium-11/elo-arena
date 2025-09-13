export default function Logo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="22" stroke="#5b9aff" strokeWidth="6" opacity=".8" fill="none" />
      <circle cx="32" cy="32" r="6" fill="#5b9aff" />
    </svg>
  )
}

