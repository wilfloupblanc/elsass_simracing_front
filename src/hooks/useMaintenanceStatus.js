import { useEffect, useState } from "react"

export const useMaintenanceStatus = () => {
    const [isMaintenance, setIsMaintenance] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/setting/maintenance/status`)
                const data = await res.json()
                setIsMaintenance(data.maintenance)
            } catch {
                setIsMaintenance(false)
            } finally {
                setIsLoading(false)
            }
        }

        check()
        const interval = setInterval(check, 3000)
        return () => clearInterval(interval)
    }, [])

    return { isMaintenance, isLoading }
}