'use client'

import { Ban } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const UnauthorizedPage = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center">
      <Ban size={120} className="text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
      <p className="text-gray-600 mb-6">You are not authorized to view this page.</p>
      <button
        onClick={() => router.back()}
        className="px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-200"
      >
        Go Back
      </button>
    </div>
  )
}

export default UnauthorizedPage
