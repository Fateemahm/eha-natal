'use client';

import React, {useEffect, useState} from 'react'
import Header from '@/components/Header'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import CompleteProfileModal from '@/app/dashboard/component/complete-profile-modal'

export default function page() {
  const { data: session } = useSession()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return

      // Fetch user profile data from the backend
        const response = await axios.get('/api/user-profile', {
          params: { userId: session.user.id },
        })
        console.log('User profile data:', response)
      if (response.data.message === "Profile not found."){
        setModalOpen(true)

      }
       
    }
     
    fetchData()
  }, [session])

  return (
    <div>
      <Header />
      {modalOpen && (
        <CompleteProfileModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
      This is the dashboard page.
    </div>
  )
}
