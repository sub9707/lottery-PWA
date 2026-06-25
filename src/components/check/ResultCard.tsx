import type { CheckResult } from '../../types'
import { Badge } from '../ui/Badge'

export function ResultCard({ result }: { result: CheckResult }) {
  if (result.status === 'win') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 lg:px-12 py-10 lg:py-0">
        <p className="text-xs text-emerald-500 uppercase tracking-[0.3em] mb-5 font-semibold">당첨</p>
        <div className="text-6xl sm:text-7xl lg:text-[80px] xl:text-[96px] font-black text-slate-100 leading-none tabular-nums mb-2">
          {result.number}
        </div>
        <p className="text-zinc-500 text-sm mb-6">번</p>
        <Badge rank={result.rank!} className="text-base lg:text-lg px-5 py-2 mb-4" />
        <p className="text-xl lg:text-2xl font-bold text-emerald-400 mt-2">{result.prize?.name}</p>
      </div>
    )
  }
  if (result.status === 'used') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 lg:px-12 py-10 lg:py-0">
        <p className="text-xs text-yellow-500 uppercase tracking-[0.3em] mb-5 font-semibold">이미 수령됨</p>
        <div className="text-6xl sm:text-7xl lg:text-[80px] font-black text-slate-100 leading-none tabular-nums mb-2">
          {result.number}
        </div>
        <p className="text-zinc-500 text-sm mb-4">번</p>
        <p className="text-zinc-400 text-base">이미 수령 확정된 번호입니다</p>
        {result.confirmedAt && (
          <p className="text-zinc-600 text-sm mt-2">{new Date(result.confirmedAt).toLocaleString('ko-KR')}</p>
        )}
      </div>
    )
  }
  if (result.status === 'not_ready') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-10 lg:py-0">
        <p className="text-xs text-zinc-600 uppercase tracking-[0.3em] mb-5 font-semibold">배정 전</p>
        <p className="text-zinc-500 text-base leading-relaxed">
          번호 배정이 필요합니다.<br />관리자 설정에서 번호 섞기를 실행해 주세요.
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-10 lg:py-0">
      <p className="text-xs text-red-500 uppercase tracking-[0.3em] mb-5 font-semibold">잘못된 번호</p>
      <p className="text-zinc-400 text-base">1 ~ 1000 사이의 번호를 입력해 주세요</p>
    </div>
  )
}
