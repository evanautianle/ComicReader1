import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileForm from '../components/profile/ProfileForm'
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

      <ProfileForm
        displayName={displayName}
        loading={loading}
        status={status}
        error={error}
        onDisplayNameChange={setDisplayName}
        onSave={handleSave}
      />
    </div>
  )
}
