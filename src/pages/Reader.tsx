import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReaderControls from '../components/reader/ReaderControls'
import ReaderToolbar from '../components/reader/ReaderToolbar'
import ReaderViewport from '../components/reader/ReaderViewport'
import { supabase } from '../lib/supabaseClient'

type Page = {
  id: string
  page_number: number | null
  image_url: string | null
}

export default function Reader() {
  const { chapterId } = useParams()

  // 3 states for pages list, current page index, and error handling
  const [pages, setPages] = useState<Page[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chapterId) return

    const fetchPages = async () => {
      // fetch pages
      const { data, error } = await supabase
        .from('pages')
        .select('id, page_number, image_url')
        .eq('chapter_id', chapterId)
        .order('page_number', { ascending: true })

      if (error) {
        setError(error.message)
        return
      }

      setPages(data ?? [])
      setCurrentIndex(0)
    }

    fetchPages()
  }, [chapterId])

  const currentPage = pages[currentIndex]

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <ReaderToolbar currentIndex={currentIndex} totalPages={pages.length} />

      {error ? (
        <div className="mt-4 text-sm text-red-400">{error}</div>
      ) : null}

      <ReaderViewport
        imageUrl={currentPage?.image_url ?? null}
        pageIndex={currentIndex}
      />
      <ReaderControls
        currentIndex={currentIndex}
        totalPages={pages.length}
        onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
        onNext={() =>
          setCurrentIndex((prev) => Math.min(prev + 1, pages.length - 1))
        }
      />
    </div>
  )
}
