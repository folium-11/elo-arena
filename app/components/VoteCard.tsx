"use client"
import Image from 'next/image'
import { Item, Rating } from '@/lib/types'

export default function VoteCard({ item, rating, onClick, side }: {
  item: Item
  rating: Rating
  onClick: () => void
  side: 'left' | 'right'
}) {
  return (
    <button
      className="card lift w-full h-full flex flex-col items-center justify-between overflow-hidden focus-visible:ring-2"
      onClick={onClick}
      aria-label={`Vote ${item.baseName}`}
    >
      <div className="w-full aspect-[4/3] relative bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.baseName} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-neutral-400">{item.baseName}</div>
        )}
      </div>
      <div className="w-full flex items-center justify-between mt-3">
        <div className="text-left">
          <div className="font-semibold leading-tight">{item.baseName}</div>
          <div className="text-xs text-neutral-500">{Math.round(rating.rating)}</div>
        </div>
        <div className="text-xs text-neutral-500">{side === 'left' ? '←' : '→'}</div>
      </div>
    </button>
  )
}

