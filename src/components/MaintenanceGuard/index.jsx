import { useMaintenanceStatus } from "../../hooks/useMaintenanceStatus"
import { Maintenance } from "../../pages/Maintenance"

export const MaintenanceGuard = ({ children }) => {
    const { isMaintenance, isLoading } = useMaintenanceStatus()

    if (isLoading) return null

    if (isMaintenance) return <Maintenance />

    return children
}