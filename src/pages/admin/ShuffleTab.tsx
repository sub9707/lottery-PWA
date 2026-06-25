import { useState } from 'react'
import { useLotteryStore } from '../../store/useLotteryStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'

type ModalType = 'shuffle' | 'clearConfirmed' | 'resetAll' | null

export function ShuffleTab() {
  const { lastShuffleAt, shuffle, clearConfirmedEntries, resetAll, loading } = useLotteryStore()
  const [modal, setModal] = useState<ModalType>(null)

  const modalConfig = {
    shuffle: {
      title: '번호 섞기',
      message: '기존 번호 배정과 확인 내역이 모두 초기화됩니다.\n계속 진행하시겠습니까?',
      onConfirm: async () => { setModal(null); await shuffle() },
    },
    clearConfirmed: {
      title: '확인 내역 초기화',
      message: '확인 내역만 삭제됩니다. 번호 배정은 유지됩니다.\n계속 진행하시겠습니까?',
      onConfirm: async () => { setModal(null); await clearConfirmedEntries() },
    },
    resetAll: {
      title: '전체 초기화',
      message: '상품, 번호 배정, 확인 내역이 모두 기본값으로 초기화됩니다.\n계속 진행하시겠습니까?',
      onConfirm: async () => { setModal(null); await resetAll() },
    },
  }

  const active = modal ? modalConfig[modal] : null

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded p-5">
        <div className="text-xs text-zinc-600 uppercase tracking-widest mb-2">마지막 번호 배정</div>
        <div className="text-lg font-semibold text-slate-300">
          {lastShuffleAt ? new Date(lastShuffleAt).toLocaleString('ko-KR') : '미실행'}
        </div>
      </div>

      <Button fullWidth size="xl" onClick={() => setModal('shuffle')} disabled={loading}>
        번호 섞기
      </Button>

      <div className="border-t border-zinc-800 pt-5 flex flex-col gap-3">
        <Button variant="ghost" fullWidth size="lg" onClick={() => setModal('clearConfirmed')} disabled={loading}>
          확인 내역만 초기화
        </Button>
        <Button variant="danger" fullWidth size="lg" onClick={() => setModal('resetAll')} disabled={loading}>
          전체 초기화
        </Button>
      </div>

      {active && (
        <Modal
          open
          title={active.title}
          message={active.message}
          confirmLabel="실행"
          danger={modal === 'resetAll' || modal === 'clearConfirmed'}
          onConfirm={active.onConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}
