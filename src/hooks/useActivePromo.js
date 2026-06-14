import { useEffect, useState } from 'react'

export function useActivePromo() {
    const [promo, setPromo] = useState(null)

    useEffect(() => {
        if (sessionStorage.getItem('promo_dismissed')) return

        fetch(`${import.meta.env.VITE_API_URL}/discount-code/active`)
            .then(r => r.json())
            .then(data => { if (data.active) setPromo(data.promo) })
            .catch(() => {})
    }, [])

    const dismiss = () => {
        sessionStorage.setItem('promo_dismissed', '1')
        setPromo(null)
    }

    return { promo, dismiss }
}