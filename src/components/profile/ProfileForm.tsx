type ProfileFormProps = {
  displayName: string
  loading: boolean
  status: string | null
  error: string | null
  onDisplayNameChange: (value: string) => void
  onSave: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function ProfileForm({
  displayName,
  loading,
  status,
  error,
  onDisplayNameChange,
  onSave,
}: ProfileFormProps) {
  return (
    <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <h1 className="text-lg font-semibold text-neutral-100">Your profile</h1>
      <p className="mt-1 text-xs text-neutral-400">
        Update how your name appears in the app.
      </p>

      <form onSubmit={onSave} className="mt-6 grid gap-3">
        <label className="text-xs font-medium text-neutral-300">
          Display name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(event) => onDisplayNameChange(event.target.value)}
          placeholder="Display name"
          className="h-10 rounded-md border border-neutral-800 bg-neutral-950 px-3 text-sm text-neutral-100 placeholder:text-neutral-600"
          maxLength={60}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 transition hover:border-neutral-700 disabled:opacity-50"
          >
            Save
          </button>
          {status ? (
            <span className="text-xs text-emerald-400">{status}</span>
          ) : null}
          {error ? <span className="text-xs text-red-400">{error}</span> : null}
        </div>
      </form>
    </div>
  )
}
