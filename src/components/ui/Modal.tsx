import { useEffect } from 'react'
import { Button } from './Button'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function Modal({ open, title, message, confirmLabel = '확인', cancelLabel = '취소', danger, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-zinc-900 border border-zinc-700 rounded w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-2">{title}</h2>
        <p className="text-zinc-400 mb-6 whitespace-pre-wrap text-sm">{message}</p>
        <div className="flex gap-3">
          <Button variant="ghost" size="md" fullWidth onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} size="md" fullWidth onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
