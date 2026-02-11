type Comment = {
  id: string
  content: string
  createdAt: string
  authorName: string
  isAuthor: boolean
}

type CommentsListProps = {
  comments: Comment[]
  loading: boolean
  error: string | null
}

const formatTimestamp = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

export default function CommentsList({
  comments,
  loading,
  error,
}: CommentsListProps) {
  return (
    <section className="mt-8 rounded-lg border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-100">Comments</h2>
        {loading ? (
          <span className="text-xs text-neutral-500">Loading...</span>
        ) : null}
      </div>

      {error ? (
        <div className="mt-3 text-xs text-red-400">{error}</div>
      ) : null}

      {comments.length === 0 && !loading ? (
        <p className="mt-3 text-xs text-neutral-400">No comments yet.</p>
      ) : null}

      <div className="mt-4 grid gap-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3 text-xs text-neutral-500">
              <span className="font-medium text-neutral-200">
                {comment.authorName}
                {comment.isAuthor ? ' (you)' : ''}
              </span>
              <span>{formatTimestamp(comment.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-200">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
