import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type ProfileRow = {
  id: string
  display_name: string | null
}

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError(null)
      setStatus(null)

      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        setError(userError?.message ?? 'Sign in required.')
        setLoading(false)
        return
      }

      setUserId(userData.user.id)

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('id', userData.user.id)
        .maybeSingle<ProfileRow>()

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      setDisplayName(data?.display_name ?? '')
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userId) {
      setError('Sign in required.')
      return
    }

    setLoading(true)
    setError(null)
    setStatus(null)

    const nextName = displayName.trim()

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: userId, display_name: nextName || null })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setStatus('Profile updated.')
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
        Back to browse
      </Link>

      <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <h1 className="text-lg font-semibold text-neutral-100">Your profile</h1>
        <p className="mt-1 text-xs text-neutral-400">
          Update how your name appears in the app.
        </p>

        <form onSubmit={handleSave} className="mt-6 grid gap-3">
          <label className="text-xs font-medium text-neutral-300">
            Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
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
    </div>
  )
}
