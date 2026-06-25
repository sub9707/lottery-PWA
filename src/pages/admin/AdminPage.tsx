import { useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { PrizeSettingTab } from './PrizeSettingTab'
import { ShuffleTab } from './ShuffleTab'
import { InventoryTab } from './InventoryTab'

type Tab = 'prizes' | 'shuffle' | 'inventory'

const TABS: { key: Tab; label: string }[] = [
  { key: 'prizes', label: '상품 설정' },
  { key: 'shuffle', label: '번호 관리' },
  { key: 'inventory', label: '재고 현황' },
]

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('prizes')

  return (
    <PageLayout title="관리자 설정" showBack mainClass="flex flex-col lg:flex-row lg:overflow-hidden">
      {/* Mobile: top tab bar / Desktop: sidebar */}
      <div className="flex lg:flex-col gap-1 p-3 lg:p-3 border-b lg:border-b-0 lg:border-r border-zinc-800 lg:w-48 lg:shrink-0 overflow-x-auto lg:overflow-x-visible lg:pt-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 text-left px-4 py-2.5 rounded text-sm font-semibold transition-colors min-h-[44px] lg:w-full
              ${tab === t.key
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-xl mx-auto lg:mx-0">
          {tab === 'prizes' && <PrizeSettingTab />}
          {tab === 'shuffle' && <ShuffleTab />}
          {tab === 'inventory' && <InventoryTab />}
        </div>
      </div>
    </PageLayout>
  )
}
