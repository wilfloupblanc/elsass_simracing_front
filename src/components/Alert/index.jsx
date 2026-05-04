import {useState} from "react"
import {createPortal} from "react-dom"
import "./Alert.scss"

export const Alert = ({ children, openBtnText, onOpen = null, btnClassName = "bg-error border-error text-secondary open-alert" }) => {
    const [alertOpen, setAlertOpen] = useState(false)

    const handleOpen = () => {
        if (onOpen) onOpen()
        setAlertOpen(true)
    }

    const handleClose = () => setAlertOpen(false)

    return (
        <>
            <button onClick={handleOpen} className={btnClassName}>{openBtnText}</button>
            {alertOpen && createPortal(
                <section className="alert">
                    <div>
                        {typeof children === "function" ? children({ onClose: handleClose }) : children}
                    </div>
                </section>,
                document.body
            )}
        </>
    )
}