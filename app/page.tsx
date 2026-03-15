import React from 'react'
import LeftPanel  from '@/components/layout/LeftPanel'
import RightPanel from '@/components/layout/RightPanel'


export default function HomePage() {
  return (
    <main
      className="flex"
      style={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}
    >
      {/* Branded left section */}
      <LeftPanel />

      {/* Login form right section */}
      <RightPanel />
    </main>
  )
}
