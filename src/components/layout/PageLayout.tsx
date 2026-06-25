import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  children: ReactNode
  showBack?: boolean
  headerRight?: ReactNode
  mainClass?: string
}

export function PageLayout({ title, children, showBack, headerRight, mainClass }: Props) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen lg:h-screen bg-zinc-950 flex flex-col lg:overflow-hidden">
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 lg:px-6 flex items-center gap-3 shrink-0 h-13 min-h-[52px]">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400 text-xl font-bold transition-colors"
          >
            ←
          </button>
        )}
        <h1 className="flex-1 text-base font-bold text-slate-100 tracking-tight">{title}</h1>
        {headerRight}
      </header>
      <main className={`flex-1 ${mainClass ?? 'p-4 lg:p-6 overflow-y-auto'}`}>
        {children}
      </main>
    </div>
  )
}
