import Link from 'next/link'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xs border-b border-neutral-200/60 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold">Elo Arena</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link className="btn btn-ghost" href="/">Arena</Link>
          <Link className="btn btn-ghost" href="/leaderboards">Leaderboards</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

