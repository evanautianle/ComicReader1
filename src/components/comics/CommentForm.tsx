import { useState } from 'react'

type CommentFormProps = {
  loading: boolean
  error: string | null
  onSubmit: (content: string) => Promise<boolean>
}

export default function CommentForm({
  loading,
  error,
  onSubmit,
}: CommentFormProps) {
  const [content, setContent] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const didSubmit = await onSubmit(content)
    if (didSubmit) {
      setContent('')
    }
  }

  return (
    <section className="mt-8 rounded-lg border border-neutral-800 bg-neutral-900 p-5">
      <h2 className="text-sm font-semibold text-neutral-100">Add a comment</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share your thoughts about this comic..."
          className="min-h-[110px] rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600"
          maxLength={800}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || content.trim().length === 0}
            className="rounded-md border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 transition hover:border-neutral-700 disabled:opacity-50"
          >
            Post comment
          </button>
          {error ? <span className="text-xs text-red-400">{error}</span> : null}
        </div>
      </form>
    </section>
  )
}
