import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-slate-100 hover:bg-white active:bg-slate-200 text-zinc-900',
  ghost:   'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-slate-200 border border-zinc-700',
  danger:  'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-4 py-2.5 text-sm   min-h-[44px]',
  md: 'px-5 py-3.5 text-base min-h-[56px]',
  lg: 'px-6 py-4   text-lg   min-h-[64px]',
  xl: 'px-8 py-5   text-xl   min-h-[76px]',
}

export function Button({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...rest }: Props) {
  return (
    <button
      className={`
        rounded font-semibold transition-colors select-none
        disabled:opacity-30 disabled:pointer-events-none
        ${variantClass[variant]} ${sizeClass[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  )
}
