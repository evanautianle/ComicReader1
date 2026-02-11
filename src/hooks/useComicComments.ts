import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type CommentRow = {
  id: string
  content: string
  created_at: string
  user_id: string
}

type Comment = {
  id: string
  content: string
  createdAt: string
  authorName: string
  isAuthor: boolean
}

type UseComicCommentsResult = {
  comments: Comment[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export default function useComicComments(
  comicId: string | undefined,
): UseComicCommentsResult {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserEmailPrefix, setCurrentUserEmailPrefix] = useState<
    string | null
  >(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data, error: userError } = await supabase.auth.getUser()
      if (userError) {
        setError(userError.message)
        return
      }

      const emailPrefix = data.user?.email?.split('@')[0] ?? null
      setCurrentUserId(data.user?.id ?? null)
      setCurrentUserEmailPrefix(emailPrefix)
    }

    loadUser()
  }, [])

  const mapComment = useCallback(
    (row: CommentRow, displayName: string | null): Comment => {
      const trimmedName = displayName?.trim() || null
      const isAuthor = row.user_id === currentUserId
      const fallbackName =
        isAuthor && currentUserEmailPrefix
          ? currentUserEmailPrefix
          : 'Reader'

      return {
        id: row.id,
        content: row.content,
        createdAt: row.created_at,
        authorName: trimmedName ?? fallbackName,
        isAuthor,
      }
    },
    [currentUserEmailPrefix, currentUserId],
  )

  const refresh = useCallback(async () => {
    if (!comicId) return

    setLoading(true)
    setError(null)

    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id')
      .eq('comic_id', comicId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (commentError) {
      setError(commentError.message)
      setLoading(false)
      return
    }

    const rows = (commentData as CommentRow[] | null) ?? []
    const uniqueUserIds = Array.from(
      new Set(rows.map((row) => row.user_id).filter(Boolean)),
    )

    let displayNameByUserId = new Map<string, string | null>()

    if (uniqueUserIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', uniqueUserIds)

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      displayNameByUserId = new Map(
        (profileData ?? []).map((profile) => [
          profile.id as string,
          (profile.display_name as string | null) ?? null,
        ]),
      )
    }

    setComments(
      rows.map((row) => mapComment(row, displayNameByUserId.get(row.user_id) ?? null)),
    )
    setLoading(false)
  }, [comicId, mapComment])

  useEffect(() => {
    refresh()
  }, [refresh])

  const result = useMemo(
    () => ({ comments, loading, error, refresh }),
    [comments, error, loading, refresh],
  )

  return result
}
