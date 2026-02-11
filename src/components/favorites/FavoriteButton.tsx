type FavoriteButtonProps = {
  isFavorite: boolean
  loading: boolean
  onToggle: () => void
  disabled?: boolean
}

export default function FavoriteButton({
  isFavorite,
  loading,
  onToggle,
  disabled = false,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading || disabled}
      className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-200 transition hover:border-neutral-700 disabled:opacity-50"
    >
      {isFavorite ? 'Remove favorite' : 'Add to favorites'}
    </button>
  )
}
