import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import AppHeader from './components/AppHeader'
import ComicDetail from './pages/ComicDetail'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Reader from './pages/Reader'
import { supabase } from './lib/supabaseClient'

function App() {
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

  const gatedContent = (content: JSX.Element) =>
    session ? (
      content
    ) : (
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-neutral-300">
        Sign in to access this page.
      </div>
    )

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AppHeader
        session={session}
        profileName={profileName}
        email={email}
        password={password}
        loading={loading}
        onEmailChange={(event) => setEmail(event.target.value)}
        onPasswordChange={(event) => setPassword(event.target.value)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
      />

      {authError ? (
        <div className="mx-auto max-w-6xl px-6 text-xs text-red-400">
          {authError}
        </div>
      ) : null}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic/:id" element={gatedContent(<ComicDetail />)} />
          <Route path="/favorites" element={gatedContent(<Favorites />)} />
          <Route path="/profile" element={gatedContent(<Profile />)} />
          <Route
            path="/reader/:chapterId"
            element={gatedContent(<Reader />)}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
