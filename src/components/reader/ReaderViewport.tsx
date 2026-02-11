type ReaderViewportProps = {
  imageUrl: string | null
  pageIndex: number
}

export default function ReaderViewport({
  imageUrl,
  pageIndex,
}: ReaderViewportProps) {
  return (
    <div className="mt-4 flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Page ${pageIndex + 1}`}
          className="max-h-[80vh] w-auto rounded-md"
        />
      ) : (
        <div className="py-16 text-sm text-neutral-400">No pages found.</div>
      )}
    </div>
  )
}
