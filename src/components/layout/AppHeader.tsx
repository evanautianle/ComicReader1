import type { ChangeEvent, FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import AuthForm from '../auth/AuthForm'

type AppHeaderProps = {
  session: Session | null
  profileName: string | null
  email: string
  password: string
  loading: boolean
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSignIn: (event: FormEvent<HTMLFormElement>) => void
  onSignUp: () => void
  onSignOut: () => void
}

export default function AppHeader({
  session,
  profileName,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onSignUp,
  onSignOut,
}: AppHeaderProps) {
  return (
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
          <Link
            to="/profile"
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            Profile
          </Link>
          <Link
            to="/activity"
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            Activity
          </Link>
          <Link
            to="/favorites"
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            Favorites
          </Link>
          <span className="text-xs text-neutral-400">
            {profileName || session.user.email || 'Signed in'}
          </span>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-md border border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-200 transition hover:border-neutral-700"
            disabled={loading}
          >
            Sign out
          </button>
        </div>
      ) : (
        <AuthForm
          email={email}
          password={password}
          loading={loading}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
        />
      )}
    </header>
  )
}
