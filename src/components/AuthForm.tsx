import type { ChangeEvent, FormEvent } from 'react'

type AuthFormProps = {
  email: string
  password: string
  loading: boolean
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSignIn: (event: FormEvent<HTMLFormElement>) => void
  onSignUp: () => void
}

export default function AuthForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onSignUp,
}: AuthFormProps) {
  return (
    <form onSubmit={onSignIn} className="flex flex-wrap items-center justify-end gap-2">
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={onEmailChange}
        className="h-9 w-44 rounded-md border border-neutral-800 bg-neutral-900 px-2 text-xs text-neutral-100 placeholder:text-neutral-600"
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={onPasswordChange}
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
        onClick={onSignUp}
        className="h-9 rounded-md border border-neutral-800 px-3 text-xs font-medium text-neutral-200 transition hover:border-neutral-700"
        disabled={loading}
      >
        Sign up
      </button>
    </form>
  )
}
