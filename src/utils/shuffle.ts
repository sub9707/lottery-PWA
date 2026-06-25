import type { Prize, WinnerMap } from '../types'

function fisherYates<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 컵 1~totalCups 전체가 항상 당첨.
// 상위 등수 수량만큼 등수를 채우고, 나머지는 마지막 등수로 채운 뒤 섞는다.
export function buildWinnerMap(prizes: Prize[], totalCups: number): WinnerMap {
  if (prizes.length === 0) throw new Error('상품 설정이 없습니다.')

  const upperTotal = prizes.slice(0, -1).reduce((s, p) => s + p.count, 0)
  if (upperTotal >= totalCups) throw new Error(`상위 등수 합계(${upperTotal})가 총 컵 수(${totalCups})를 초과합니다.`)

  const lastRank = prizes[prizes.length - 1].rank

  const ranks: number[] = []
  for (const prize of prizes.slice(0, -1)) {
    for (let i = 0; i < prize.count; i++) {
      ranks.push(prize.rank)
    }
  }
  while (ranks.length < totalCups) {
    ranks.push(lastRank)
  }

  const shuffled = fisherYates(ranks)
  const map: WinnerMap = {}
  for (let i = 0; i < totalCups; i++) {
    map[i + 1] = shuffled[i]
  }
  return map
}
