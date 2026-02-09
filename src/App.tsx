import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('comics').select('*')
      console.log('Data:', data, 'Error:', error)
    }
    fetchData()
  }, [])

  return <div className="text-white p-4">Supabase test running… Check console</div>
}

export default App
