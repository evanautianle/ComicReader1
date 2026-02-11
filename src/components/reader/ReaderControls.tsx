type ReaderControlsProps = {
  currentIndex: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export default function ReaderControls({
  currentIndex,
  totalPages,
  onPrev,
  onNext,
}: ReaderControlsProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 disabled:opacity-40"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={currentIndex >= totalPages - 1}
        className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
