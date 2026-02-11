import ComicsGrid from '../components/comics/ComicsGrid'
import useComics from '../hooks/useComics'

export default function Home() {
    // 2 states for comics list and error handling
  const { comics, error } = useComics()

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Comic Reader</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Browse your uploaded comics
          </p>
        </div>
        <span className="text-xs text-neutral-500">Supabase Connected</span>
      </div>

      {error ? (
        <div className="mt-4 text-sm text-red-400">{error}</div>
      ) : null}

      <ComicsGrid comics={comics} />
    </div>
  )
}
