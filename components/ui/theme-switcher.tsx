'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { SunIcon, MoonIcon } from 'lucide-react'

const ThemeSwitch = () => {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-6 w-20" />
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-[11px] text-muted-foreground">{isDark ? 'Dark' : 'Light'}</span>
            <div className="inline-flex items-center gap-2">
                <SunIcon
                    className={`size-4 ${!isDark ? 'text-primary' : 'text-muted-foreground'
                        }`}
                />
                <Switch
                    checked={isDark}
                    onCheckedChange={(checked) =>
                        setTheme(checked ? 'dark' : 'light')
                    }
                    aria-label="Toggle dark mode"
                />
                <MoonIcon
                    className={`size-4 ${isDark ? 'text-primary' : 'text-muted-foreground'
                        }`}
                />
            </div>
        </div>
    )
}

export default ThemeSwitch