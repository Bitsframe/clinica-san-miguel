import React, { FC, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '@/supabaseClient';
import moment from 'moment';

type DayTimings = {
    mon_timing: string;
    tuesday_timing: string;
    wednesday_timing: string;
    thursday_timing: string;
    friday_timing: string;
    saturday_timing: string;
    sunday_timing: string;
};

interface Props {
    data: DayTimings;
    selectDateTimeSlotHandle:(date: Date | '', time?:string | '' )=>void
}


interface ScheduleDateTimeProps extends Props {
    initialDate?: Date | null;
    initialSlot?: string;
    locationID?: number;
}

const SLOT_INTERVAL_MINUTES = 15;

/** Nobody can walk in on ten minutes' notice, so today's next slots are closed off. */
const MIN_LEAD_MINUTES = 30;

type SlotState = 'free' | 'booked' | 'past';

type Slot = { time: string; minutes: number; state: SlotState };

const PARTS_OF_DAY = [
    { key: 'morning', label: 'Morning', from: 0, to: 12 * 60 },
    { key: 'afternoon', label: 'Afternoon', from: 12 * 60, to: 17 * 60 },
    { key: 'evening', label: 'Evening', from: 17 * 60, to: 24 * 60 },
] as const;

const getTimingKey = (date: Date): keyof DayTimings => {
    const days = ['sunday_timing', 'mon_timing', 'tuesday_timing', 'wednesday_timing', 'thursday_timing', 'friday_timing', 'saturday_timing'] as const;
    return days[date.getDay()];
};

const parseTimingPart = (timeStr: string): number => {
    const match = timeStr.trim().toLowerCase().match(/(\d{1,2}):(\d{2})\s*(am|pm)/);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const modifier = match[3];
    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

const formatTimeSlot = (totalMinutes: number): string => {
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours24 < 12 ? 'AM' : 'PM';
    const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const generateTimeSlots = (timing: string): number[] => {
    const [start, end] = timing.split('-').map(str => str.trim());
    const startMinutes = parseTimingPart(start);
    const endMinutes = parseTimingPart(end);
    const slots: number[] = [];

    for (let minutes = startMinutes; minutes < endMinutes; minutes += SLOT_INTERVAL_MINUTES) {
        slots.push(minutes);
    }

    return slots;
};

const ScheduleDateTime: FC<ScheduleDateTimeProps> = ({ data, selectDateTimeSlotHandle, initialDate, initialSlot, locationID }) => {
        const [date, setDate] = useState<Date | null>(null);
        const [isClosed, setIsClosed] = useState<boolean>(false);
        const [selectedSlot, setSelectedSlot] = useState(initialSlot || '');
        const [bookedSlots, setBookedSlots] = useState<string[]>([]);
        const [isLoadingSlots, setIsLoadingSlots] = useState(false);
        const isFirstRender = useRef(true);
        const minDateRef = useRef<Date | null>(null);

        useEffect(() => {
            minDateRef.current = new Date();
            setDate(initialDate || new Date());
        }, [initialDate]);

    useEffect(() => {
        if (!date || !locationID) return;

        const formattedDate = moment(date).format('DD-MM-YYYY');
        let cancelled = false;

        // Narrow to this date in the query. Reading every appointment for the
        // location and filtering here silently loses rows once a busy clinic
        // passes PostgREST's 1000-row ceiling.
        const fetchBookedSlots = async () => {
            setIsLoadingSlots(true);
            try {
                const { data: appointmentData, error } = await supabase
                    .from('Appoinments')
                    .select('date_and_time')
                    .eq('location_id', locationID)
                    .like('date_and_time', `%${formattedDate}%`);

                if (cancelled) return;

                if (error || !appointmentData) {
                    setBookedSlots([]);
                } else {
                    setBookedSlots(
                        appointmentData
                            .map((apt: any) => {
                                const parts = String(apt.date_and_time ?? '').split(' - ');
                                return parts.length > 1 ? parts[1].trim() : '';
                            })
                            .filter((time: string) => time !== '')
                    );
                }
            } catch {
                if (!cancelled) setBookedSlots([]);
            } finally {
                if (!cancelled) setIsLoadingSlots(false);
            }
        };

        fetchBookedSlots();
        return () => { cancelled = true; };
    }, [date, locationID]);

    const slots = useMemo<Slot[]>(() => {
        if (!date) return [];

        const timings = data[getTimingKey(date)];
        if (!timings || timings.toLowerCase() === 'closed') return [];

        const isToday = moment(date).isSame(moment(), 'day');
        const nowMinutes = moment().hours() * 60 + moment().minutes() + MIN_LEAD_MINUTES;

        return generateTimeSlots(timings).map((minutes) => {
            const time = formatTimeSlot(minutes);
            let state: SlotState = 'free';
            // A slot the clinic has already passed today was still offered before,
            // so visitors could book an appointment in the past.
            if (isToday && minutes < nowMinutes) state = 'past';
            else if (bookedSlots.includes(time)) state = 'booked';
            return { time, minutes, state };
        });
    }, [date, data, bookedSlots]);

    const hasFreeSlot = slots.some((slot) => slot.state === 'free');

    useEffect(() => {
        if (!date) return;

        const timings = data[getTimingKey(date)];
        setIsClosed(!timings || timings.toLowerCase() === 'closed');

        // Only reset slot and notify parent when date actually changes (not on first render)
        if (!isFirstRender.current) {
            setSelectedSlot('');
            selectDateTimeSlotHandle(date, '');
        } else {
            isFirstRender.current = false;
        }
    }, [date, data, selectDateTimeSlotHandle]);

    const dateTimeChangeHandle = (date: Date | null) => {
        if (date) {
            setDate(date);
        }
    }

    const selectSlotHandle = useCallback((val: string) => {
        setSelectedSlot(val);
        if (date) {
            selectDateTimeSlotHandle(date, val);
        }
    }, [date, selectDateTimeSlotHandle]);

    if (!date) {
        return (
            <div className="w-full space-y-4">
                <div className="h-11 w-full sm:w-1/2 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-24 w-full rounded-xl bg-gray-100 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-5">
            <div className="flex flex-col items-start w-full sm:w-1/2">
                <label className="text-sm font-semibold text-[#19192C] font-poppins mb-1.5">
                    Select Schedule Date
                </label>
                {/* @ts-ignore */}
                <ReactDatePicker
                    minDate={minDateRef.current ?? undefined}
                    selected={date}
                    onChange={dateTimeChangeHandle}
                    placeholderText="Select date"
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom-start"
                    className="w-full h-11 border border-gray-200 text-sm text-[#19192C] placeholder:text-[#9CA3AF] px-4 bg-white outline-none rounded-xl focus:ring-2 focus:ring-[#C1001F]/20 focus:border-[#C1001F] shadow-sm"
                />
            </div>

            <div className="w-full">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <label className="text-sm font-semibold text-[#19192C] font-poppins">
                        Select Schedule Time
                    </label>
                    {selectedSlot && (
                        <span className="text-xs font-medium text-[#C1001F]">{selectedSlot} selected</span>
                    )}
                </div>

                {isClosed ? (
                    <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-[#6C7582]">
                        Closed on {moment(date).format('dddd')}. Please pick another day.
                    </p>
                ) : isLoadingSlots && slots.length === 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : !hasFreeSlot ? (
                    <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-[#6C7582]">
                        No times left on {moment(date).format('MMM D')}. Please pick another day.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {PARTS_OF_DAY.map((part) => {
                            const partSlots = slots.filter((s) => s.minutes >= part.from && s.minutes < part.to);
                            if (!partSlots.some((s) => s.state === 'free')) return null;

                            return (
                                <div key={part.key}>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6C7582]">
                                        {part.label}
                                    </p>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        {partSlots.map((slot) => {
                                            const isSelected = slot.time === selectedSlot;
                                            const isDisabled = slot.state !== 'free';

                                            return (
                                                <button
                                                    key={slot.time}
                                                    type="button"
                                                    disabled={isDisabled}
                                                    aria-pressed={isSelected}
                                                    title={slot.state === 'booked' ? 'Already booked' : undefined}
                                                    onClick={() => selectSlotHandle(slot.time)}
                                                    className={[
                                                        'h-10 rounded-lg border text-sm font-medium transition-colors',
                                                        isSelected
                                                            ? 'border-[#C1001F] bg-[#C1001F] text-white shadow-sm'
                                                            : isDisabled
                                                                ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 line-through'
                                                                : 'border-gray-200 bg-white text-[#19192C] hover:border-[#C1001F] hover:text-[#C1001F]',
                                                    ].join(' ')}
                                                >
                                                    {slot.time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ScheduleDateTime;
