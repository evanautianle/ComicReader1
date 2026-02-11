import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

type UseAuthResult = {
  session: Session | null
  profileName: string | null
  email: string
  password: string
  loading: boolean
  authError: string | null
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSignIn: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onSignUp: () => Promise<void>
  onSignOut: () => Promise<void>
}

export default function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null)
  const [profileName, setProfileName] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setAuthError(error.message)
        return
      }
      setSession(data.session)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) {
        setProfileName(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) {
        setAuthError(error.message)
        return
      }

      if (!data) {
        const fallbackName = session.user.email?.split('@')[0] ?? 'Reader'
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ id: session.user.id, display_name: fallbackName })

        if (upsertError) {
          setAuthError(upsertError.message)
          return
        }

        setProfileName(fallbackName)
        return
      }

      setProfileName(data.display_name ?? null)
    }

    loadProfile()
  }, [session])

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setAuthError(error.message)
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setAuthError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setAuthError(error.message)
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    setLoading(true)
    setAuthError(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthError(error.message)
    }
    setLoading(false)
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  return {
    session,
    profileName,
    email,
    password,
    loading,
    authError,
    onEmailChange: handleEmailChange,
    onPasswordChange: handlePasswordChange,
    onSignIn: handleSignIn,
    onSignUp: handleSignUp,
    onSignOut: handleSignOut,
  }
}
