import {useEffect, useState} from "react";
import "./TimeSlotPicker.scss"

export const TimeSlotPicker = ({ slots, selectedSlot, onSlotSelect, pilotsCount, blockedSlotIds = new Set() }) => {
    const [activeTab, setActiveTab] = useState("matin")

    useEffect(() => {
        if (slots?.matin?.length > 0) {
            setActiveTab("matin")
        } else if (slots?.apresmidi?.length > 0) {
            setActiveTab("apresmidi")
        } else {
            setActiveTab("soir")
        }

    },[slots])

    return (
        <>
            {slots === undefined &&
                <p className="unavailable text-secondary">Jour non disponible</p>
            }
            {slots &&
                <div className="timeslot bg-third">
                    <div className="timeslot__tabs">
                        <button aria-label="select morning button" onClick={() => setActiveTab("matin")} className={`timeslot__tab ${activeTab === "matin" ? 'timeslot__tab--active' : ''}`}>Matin</button>
                        <button aria-label="select afternoon button" onClick={() => setActiveTab("apresmidi")} className={`timeslot__tab ${activeTab === "apresmidi" ? 'timeslot__tab--active' : ''}`}>Après-midi</button>
                        <button aria-label="select evening button" onClick={() => setActiveTab("soir")} className={`timeslot__tab ${activeTab === "soir" ? 'timeslot__tab--active' : ''}`}>Soir</button>
                    </div>
                    {slots[activeTab].length === 0
                        ? <p className="text-secondary">Créneaux indisponible</p>
                        : <div className="timeslot__grid">
                            {slots[activeTab].map((slot, index) => {
                                const isFull = slot.slots_remaining < pilotsCount
                                const isBlocked = blockedSlotIds.has(slot.id)
                                const isDisabled = isFull || isBlocked
                                return (
                                    <button
                                        key={index}
                                        onClick={() => !isDisabled && onSlotSelect(slot)}
                                        disabled={isDisabled}
                                        className={`timeslot__slot 
                                            ${slot.time === selectedSlot?.time ? 'timeslot__slot--selected' : ''} 
                                            ${isFull ? 'timeslot__slot--full' : ''}
                                            ${isBlocked ? 'timeslot__slot--blocked' : ''}
                                        `}
                                        aria-label={slot}
                                    >
                                        <span>{slot.time}</span>
                                        <span>{isFull ? 'Complet' : isBlocked ? 'Indisponible' : `Dispo: ${slot.slots_remaining}`}</span>
                                    </button>
                                )
                            })}
                        </div>
                    }
                </div>
            }
        </>
    )
}