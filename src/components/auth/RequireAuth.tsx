import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

type RequireAuthProps = {
  session: Session | null
  children: ReactNode
  fallback?: ReactNode
}

export default function RequireAuth({
  session,
  children,
  fallback,
}: RequireAuthProps) {
  if (session) {
    return <>{children}</>
  }

  return (
    <>
      {fallback ?? (
        <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-neutral-300">
          Sign in to access this page.
        </div>
      )}
    </>
  )
}
