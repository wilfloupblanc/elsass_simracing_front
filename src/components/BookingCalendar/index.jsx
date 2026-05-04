import {useEffect, useMemo, useState} from "react";
import {useGetAvailabilitiesByMonthQuery} from "../../store/ApiSlice/availabilityApiSlice.js";
import {CalendarGrid} from "./CalendarGrid/index.jsx";
import {TimeSlotPicker} from "./TimeSlotPicker/index.jsx";
import {SessionCard} from "./SessionCard/index.jsx";
import "./BookingCalendar.scss"
import {NumberPilots} from "./NumberPilots/index.jsx";
import {useGetAllSessionsQuery} from "../../store/ApiSlice/sessionApiSlice.js";
import {useGetAuthenticatedUserQuery} from "../../store/ApiSlice/authApiSlice.js";
import {setIsModalOpen, setPendingReservation} from "../../store/slice/authSlice.js";
import {useAuthenticated} from "../../hooks/useAuthenticated.js";
import {useDispatch} from "react-redux";
import {useNavigate, useLocation} from "react-router";

export const BookingCalendar = () => {
    const todayDate = new Date()
    const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`
    const [selectedDate, setSelectedDate] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
    const {data: month, isSuccess} = useGetAvailabilitiesByMonthQuery(monthStr)
    const {data: session} = useGetAllSessionsQuery()
    const {data: authenticatedUser} = useGetAuthenticatedUserQuery()
    const [player, setPlayer] = useState(1)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const {isAuth} = useAuthenticated()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedDuration, setSelectedDuration] = useState(location.state?.duration ?? 30)
    const [selectedSessionId, setSelectedSessionId] = useState(location.state?.sessionId ?? null)

    const selectedSessionData = session?.sessions?.find(s => s.id === selectedSessionId)
        ?? session?.sessions?.find(s => s.duration_minutes === selectedDuration)

    const minPilots = selectedSessionData?.min_pilots ?? 1
    const maxPilots = selectedSessionData?.max_pilots ?? 6

    useEffect(() => {
        if (!session?.sessions) return
        if (selectedSessionId) {
            const s = session.sessions.find(s => s.id === selectedSessionId)
            if (s) {
                setSelectedDuration(s.duration_minutes)
                setPlayer(s.min_pilots ?? 1)
            }
            return
        }
        const defaultDuration = location.state?.duration ?? 30
        const defaultSession = session.sessions.find(s => s.duration_minutes === defaultDuration)
        if (defaultSession) {
            setSelectedSessionId(defaultSession.id)
            setSelectedDuration(defaultSession.duration_minutes)
            setPlayer(defaultSession.min_pilots ?? 1)
        }
    }, [session])

    const handleDateSelect = (date) => {
        setSelectedDate(date)
        setSelectedSlot(null)
    }

    const handleMonthChange = (direction) => {
        if (currentMonth === 11 && direction === 1) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1)
        } else if (currentMonth === 0 && direction === -1) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1)
        } else {
            if (direction === 1) setCurrentMonth(currentMonth + 1)
            if (direction === -1) setCurrentMonth(currentMonth - 1)
        }
    }

    const handleDurationSelect = (duration, id) => {
        setSelectedDuration(duration)
        setSelectedSessionId(id)
        const newSession = session?.sessions?.find(s => s.id === id)
        setPlayer(newSession?.min_pilots ?? 1)
    }

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot)
    }

    const availabilitiesGrid = useMemo(() => {
        return isSuccess
            ? month.availabilities.filter(slot => new Date(slot.date).toLocaleDateString('fr-FR', {year: 'numeric', month: '2-digit', day: '2-digit'}).split('/').reverse().join('-') === selectedDate)
            : []
    }, [month, selectedDate, isSuccess])

    const morning = useMemo(() => {
        return availabilitiesGrid.filter(time => time.start_time < "13:00:00")
    }, [availabilitiesGrid])

    const afternoon = useMemo(() => {
        return availabilitiesGrid.filter(time => time.start_time >= "13:00:00" && time.start_time < "18:00:00")
    }, [availabilitiesGrid])

    const evening = useMemo(() => {
        return availabilitiesGrid.filter(time => time.start_time >= "18:00:00")
    }, [availabilitiesGrid])

    const slots = useMemo(() => {
        return isSuccess && availabilitiesGrid.length > 0 ? {
            matin: morning.map(slot => ({time: slot.start_time.slice(0, 5), slots_remaining: slot.slots_remaining, id: slot.id})),
            apresmidi: afternoon.map(slot => ({time: slot.start_time.slice(0, 5), slots_remaining: slot.slots_remaining, id: slot.id})),
            soir: evening.map(slot => ({time: slot.start_time.slice(0, 5), slots_remaining: slot.slots_remaining, id: slot.id}))
        } : undefined
    }, [morning, afternoon, evening, isSuccess, availabilitiesGrid])

    const availableDatesSet = useMemo(() => {
        if (!isSuccess) return new Set()
        return new Set(
            month.availabilities.map(slot =>
                new Date(slot.date).toLocaleDateString('fr-FR', {year: 'numeric', month: '2-digit', day: '2-digit'}).split('/').reverse().join('-')
            )
        )
    }, [month, isSuccess])

    const handleReserve = () => {
        if (!isAuth) {
            dispatch(setPendingReservation({
                date: selectedDate,
                slot: selectedSlot,
                duration: selectedDuration,
                pilots: player,
                service_id: 1
            }))
            dispatch(setIsModalOpen({isModalOpen: true}))
        } else {
            navigate("/order/checkout", {
                state: {
                    date: selectedDate,
                    slot: selectedSlot,
                    duration: selectedDuration,
                    pilots: player,
                    service_id: 1
                }
            })
        }
    }

    const isReservationValid = selectedSlot !== null && selectedSlot?.slots_remaining >= player

    return (
        <section className="booking-calendar">
            <SessionCard
                sessions={session?.sessions}
                isMember={authenticatedUser?.is_member === 1}
                selectedDuration={selectedDuration}
                selectedSessionId={selectedSessionId}
                onDurationSelect={handleDurationSelect}
            />

            <section className="booking-calendar__content--number">
                <NumberPilots
                    player={player}
                    setPlayer={setPlayer}
                    minPilots={minPilots}
                    maxPilots={maxPilots}
                />
            </section>

            <div className="booking-calendar__content">
                <section className="booking-calendar__content--body bg-third">
                    <CalendarGrid
                        today={today}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        availableDates={availableDatesSet}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        onMonthChange={handleMonthChange}
                    />
                </section>
                <section className="booking-calendar__content--slot-picker">
                    {selectedDate &&
                        <TimeSlotPicker
                            slots={slots}
                            selectedSlot={selectedSlot}
                            onSlotSelect={handleSlotSelect}
                            pilotsCount={player}
                        />
                    }
                    <button
                        disabled={!isReservationValid}
                        onClick={handleReserve}
                        className={`bg-third text-secondary ${!isReservationValid ? 'disabled' : ''}`}
                    >
                        Réserver
                    </button>
                </section>
            </div>
        </section>
    )
}