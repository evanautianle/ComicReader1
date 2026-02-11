import ComicCard from './ComicCard'

type Comic = {
  id: string
  title: string
  cover_url: string | null
}

type ComicsGridProps = {
  comics: Comic[]
}

export default function ComicsGrid({ comics }: ComicsGridProps) {
  return (
    <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {comics.map((comic) => (
        <ComicCard
          key={comic.id}
          id={comic.id}
          title={comic.title}
          coverUrl={comic.cover_url}
        />
      ))}
    </div>
  )
}
