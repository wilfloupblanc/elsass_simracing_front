import {GreaterThanIcon, LessThanIcon} from "@phosphor-icons/react";
import "./CalendarGrid.scss"

export const CalendarGrid = ({currentMonth, currentYear, today, selectedDate, onDateSelect, onMonthChange, availableDates}) => {
    const date = new Date(currentYear, currentMonth, 1).getDay()
    const firstDayOnMonth = (date + 6) % 7
    const daysInMonth = new Date(currentYear, currentMonth + 1,0).getDate()
    const calendarGrid = Array.from({length: firstDayOnMonth + daysInMonth},
        (_, index) => {
        if(index < firstDayOnMonth) {
            return null
        } else {
            return ( index - firstDayOnMonth + 1)
        }
    })
    const displayMonth = new Date(currentYear, currentMonth).toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'})

    return (
        <section className="calendar">

            {/*Header: navigation mois/année*/}
            <div className="calendar__header bg-primary">
                <button
                    onClick={() => onMonthChange(-1)}
                    disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}

                >
                    <LessThanIcon size={16}  className="text-secondary"/>
                </button>
                <span className="text-secondary">{displayMonth}</span>
                <button
                    onClick={() => onMonthChange(1)}
                >
                    <GreaterThanIcon size={16}  className="text-secondary"/>
                </button>
            </div>

            {/*Jours de la semaine*/}
            <div className="calendar__days-header bg-primary">
                <span className="text-secondary">LU</span>
                <span className="text-secondary">MA</span>
                <span className="text-secondary">ME</span>
                <span className="text-secondary">JE</span>
                <span className="text-secondary">VE</span>
                <span className="text-secondary">SA</span>
                <span className="text-secondary">Di</span>
            </div>

            {/*Grille des cases*/}
            <div className="calendar__grid">
                {calendarGrid.map((day, index) => {
                    if( day === null) {
                        return (
                            <div key={index}></div>
                        )
                    } else {
                        const cellDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        const isUnavailable = availableDates && !availableDates.has(cellDate)
                        return (
                            <button
                                key={index}
                                onClick={() => onDateSelect(cellDate)}
                                className={`calendar__cell
                                    ${cellDate === selectedDate ? `calendar__cell--selected` : ''}
                                    ${cellDate === today ? `calendar__cell--today` : ''}
                                    ${cellDate < today ? `calendar__cell--past` : ''}
                                `}
                                disabled={cellDate < today || isUnavailable}
                            >
                                {day}
                            </button>
                        )
                    }
                })}
            </div>
        </section>
    )
}