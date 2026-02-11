import { Link } from 'react-router-dom'

type ReaderToolbarProps = {
  currentIndex: number
  totalPages: number
}

export default function ReaderToolbar({
  currentIndex,
  totalPages,
}: ReaderToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
        Back to browse
      </Link>
      <span className="text-xs text-neutral-500">
        Page {totalPages ? currentIndex + 1 : 0} / {totalPages}
      </span>
    </div>
  )
}
