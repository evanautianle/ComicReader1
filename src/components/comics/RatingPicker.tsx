type RatingPickerProps = {
  value: number | null
  average: number | null
  count: number
  loading: boolean
  submitting: boolean
  error: string | null
  max?: number
  disabled?: boolean
  onChange: (value: number) => void
}

const buildButtons = (max: number) =>
  Array.from({ length: max }, (_value, index) => index + 1)

export default function RatingPicker({
  value,
  average,
  count,
  loading,
  submitting,
  error,
  max = 5,
  disabled = false,
  onChange,
}: RatingPickerProps) {
  const label = value ? `${value}/${max}` : `--/${max}`
  const averageLabel =
    average === null ? 'No ratings yet.' : `Average: ${average.toFixed(1)} (${count})`

  return (
    <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-neutral-100">Your rating</p>
          <p className="text-[11px] text-neutral-500">
            {disabled ? 'Sign in to rate this comic.' : `Current: ${label}`}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {loading ? 'Loading ratings...' : averageLabel}
          </p>
          {error ? (
            <p className="mt-1 text-[11px] text-red-400">{error}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {buildButtons(max).map((rating) => {
            const isActive = value !== null && rating <= value
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                disabled={disabled || submitting}
                className={
                  isActive
                    ? 'h-8 w-8 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400 disabled:opacity-50'
                    : 'h-8 w-8 rounded-md border border-neutral-800 bg-neutral-950 text-xs font-semibold text-neutral-300 transition hover:border-neutral-700 disabled:opacity-50'
                }
                aria-label={`Rate ${rating} of ${max}`}
              >
                {rating}
              </button>
            )
          })}
        </div>
      </div>
      {submitting ? (
        <p className="mt-2 text-[11px] text-neutral-500">Saving...</p>
      ) : null}
    </div>
  )
}
