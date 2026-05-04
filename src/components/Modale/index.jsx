import {useEffect, useState} from "react"
import {createPortal} from "react-dom"
import "./Modale.scss"

export const Modale = ({ children, openBtnText, onOpen = null, forceOpen = false, onClose = null, btnClassName = "bg-secondary submit" }) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if(forceOpen) setIsOpen(true)
    }, [forceOpen])

    const handleOpen = () => {
        if (onOpen) onOpen()
        setIsOpen(true)
    }

    const handleClose = () => {
        if(onClose) onClose()
        setIsOpen(false)
    }

    return (
        <>
            <button onClick={handleOpen} className={btnClassName}>{openBtnText}</button>
            {isOpen && createPortal(
                <section className="modale">
                    <div>
                        <button onClick={handleClose} className="text-secondary">X</button>
                        {typeof children === "function" ? children({ onClose: handleClose }) : children}
                    </div>
                </section>,
                document.body
            )}
        </>
    )
}