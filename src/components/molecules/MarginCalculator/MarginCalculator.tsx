import { useState } from 'react'

interface MarginCalculatorProps {
  onClose: () => void
}

export function MarginCalculator({ onClose }: MarginCalculatorProps) {
  const [ugyfelAr, setUgyfelAr] = useState('')
  const [fuvarozóAr, setFuvarozóAr] = useState('')

  const u = parseFloat(ugyfelAr.replace(',', '.')) || 0
  const f = parseFloat(fuvarozóAr.replace(',', '.')) || 0
  const arres = u - f
  const pct = u > 0 ? (arres / u) * 100 : 0
  const hasResult = u > 0 || f > 0
  const isPositive = arres > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Árrés kalkulátor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1">×</button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Ügyfél ára (EUR)</span>
            <input
              type="number"
              inputMode="decimal"
              value={ugyfelAr}
              onChange={e => setUgyfelAr(e.target.value)}
              placeholder="0"
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Fuvarozó ára (EUR)</span>
            <input
              type="number"
              inputMode="decimal"
              value={fuvarozóAr}
              onChange={e => setFuvarozóAr(e.target.value)}
              placeholder="0"
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {hasResult && (
          <div className={`mt-5 rounded-xl p-4 text-center ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-sm font-medium text-gray-500 mb-1">Árrés</p>
            <p className={`text-3xl font-bold ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
              {arres > 0 ? '+' : ''}{arres.toFixed(0)} EUR
            </p>
            {u > 0 && (
              <p className={`text-sm mt-1 font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {pct.toFixed(1)}%
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
