import { Route, Routes } from 'react-router-dom'
import AppHeader from './components/layout/AppHeader'
import RequireAuth from './components/auth/RequireAuth'
import ComicDetail from './pages/ComicDetail'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Reader from './pages/Reader'
import useAuth from './hooks/useAuth'

function App() {
  const {
    session,
    profileName,
    email,
    password,
    loading,
    authError,
    onEmailChange,
    onPasswordChange,
    onSignIn,
    onSignUp,
    onSignOut,
  } = useAuth()

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AppHeader
        session={session}
        profileName={profileName}
        email={email}
        password={password}
        loading={loading}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onSignOut={onSignOut}
      />

      {authError ? (
        <div className="mx-auto max-w-6xl px-6 text-xs text-red-400">
          {authError}
        </div>
      ) : null}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/comic/:id"
            element={
              <RequireAuth session={session}>
                <ComicDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/favorites"
            element={
              <RequireAuth session={session}>
                <Favorites />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth session={session}>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/reader/:chapterId"
            element={
              <RequireAuth session={session}>
                <Reader />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
