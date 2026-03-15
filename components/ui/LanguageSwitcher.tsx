'use client'

import React, { ReactElement } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher(): ReactElement {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    router.refresh()
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    padding: '4px',
    background: '#0c1828',
    border: '1px solid #1a2d45',
    borderRadius: '8px',
    width: 'fit-content'
  }

  const getButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    background: isActive ? '#3b6fe0' : 'transparent',
    color: isActive ? '#fff' : '#6b7d96',
  })

  return (
    <div style={containerStyle}>
      <button 
        onClick={() => switchLocale('en')}
        style={getButtonStyle(locale === 'en')}
      >
        EN
      </button>
      <button 
        onClick={() => switchLocale('hi')}
        style={getButtonStyle(locale === 'hi')}
      >
        हिं
      </button>
    </div>
  )
}
