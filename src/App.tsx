import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import ComicDetail from './pages/ComicDetail'
import Home from './pages/Home'
import Reader from './pages/Reader'
import { supabase } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState<Session | null>(null)
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Comic Reader
          </div>
          <div className="text-xs text-neutral-400">
            Auth {session ? 'enabled' : 'ready'}
          </div>
        </div>
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">
              {session.user.email ?? 'Signed in'}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md border border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-200 transition hover:border-neutral-700"
              disabled={loading}
            >
              Sign out
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSignIn}
            className="flex flex-wrap items-center justify-end gap-2"
          >
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-9 w-44 rounded-md border border-neutral-800 bg-neutral-900 px-2 text-xs text-neutral-100 placeholder:text-neutral-600"
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-9 w-36 rounded-md border border-neutral-800 bg-neutral-900 px-2 text-xs text-neutral-100 placeholder:text-neutral-600"
              required
            />
            <button
              type="submit"
              className="h-9 rounded-md border border-neutral-800 px-3 text-xs font-medium text-neutral-200 transition hover:border-neutral-700"
              disabled={loading}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="h-9 rounded-md border border-neutral-800 px-3 text-xs font-medium text-neutral-200 transition hover:border-neutral-700"
              disabled={loading}
            >
              Sign up
            </button>
          </form>
        )}
      </header>

      {authError ? (
        <div className="mx-auto max-w-6xl px-6 text-xs text-red-400">
          {authError}
        </div>
      ) : null}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic/:id" element={<ComicDetail />} />
          <Route path="/reader/:chapterId" element={<Reader />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
