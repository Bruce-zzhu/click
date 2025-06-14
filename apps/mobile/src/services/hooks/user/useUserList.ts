import { supabase } from '@app/integrations/supabase'
import { Database } from '@app/integrations/supabase/database.types'
import { useInfiniteQuery } from '@tanstack/react-query'

type User = Database['public']['Tables']['users']['Row']
const PAGE_SIZE = 20

const fetchUsers = async ({ pageParam = 0 }: { pageParam: number }): Promise<User[]> => {
  const from = pageParam * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .range(from, to)
    .order('id', { ascending: true })

  if (error) throw error
  return data ?? []
}

export const useUserList = () => {
  return useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam }) => fetchUsers({ pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
    initialPageParam: 0,
  })
}
