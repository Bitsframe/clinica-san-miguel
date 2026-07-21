import React, { FC, useState, useEffect, useRef } from 'react';
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

const ScheduleDateTime: FC<ScheduleDateTimeProps> = ({ data, selectDateTimeSlotHandle, initialDate, initialSlot, locationID }) => {
        const [date, setDate] = useState<Date | null>(null);
        const [availableTimes, setAvailableTimes] = useState<string[]>([]);
        const [isClosed, setIsClosed] = useState<boolean>(false);
        const [selectedSlot, setSelectedSlot] = useState(initialSlot || '');
        const [bookedSlots, setBookedSlots] = useState<string[]>([]);
        const isFirstRender = useRef(true);
        const minDateRef = useRef<Date | null>(null);

        useEffect(() => {
            minDateRef.current = new Date();
            setDate(initialDate || new Date());
        }, [initialDate]);

    const getTimingKey = (date: Date): keyof DayTimings => {
        const days = ['sunday_timing', 'mon_timing', 'tuesday_timing', 'wednesday_timing', 'thursday_timing', 'friday_timing', 'saturday_timing'] as const;
        return days[date.getDay()];
    };

    const SLOT_INTERVAL_MINUTES = 15;

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

    const generateTimeSlots = (timing: string) => {
        const [start, end] = timing.split('-').map(str => str.trim());
        const startMinutes = parseTimingPart(start);
        const endMinutes = parseTimingPart(end);
        const timeSlots: string[] = [];

        for (let minutes = startMinutes; minutes < endMinutes; minutes += SLOT_INTERVAL_MINUTES) {
            timeSlots.push(formatTimeSlot(minutes));
        }

        return timeSlots;
    };


    useEffect(() => {
        if (date && locationID) {
            const formattedDate = moment(date).format('DD-MM-YYYY');
            
            // Fetch booked appointments for this date and location
            const fetchBookedSlots = async () => {
                try {
                    const { data: appointmentData, error } = await supabase
                        .from('Appoinments')
                        .select('date_and_time')
                        .eq('location_id', locationID);

                    if (error) {
                        setBookedSlots([]);
                    } else if (appointmentData) {
                        // Extract time slots for the selected date
                        const booked = appointmentData
                            .filter((apt: any) => apt.date_and_time && apt.date_and_time.includes(formattedDate))
                            .map((apt: any) => {
                                const parts = apt.date_and_time.split(' - ');
                                return parts.length > 1 ? parts[1].trim() : '';
                            })
                            .filter((time: string) => time !== '');
                        setBookedSlots(booked);
                    }
                } catch {
                    setBookedSlots([]);
                }
            };

            fetchBookedSlots();
        }
    }, [date, locationID]);

    useEffect(() => {
        if (date) {
            const timingKey = getTimingKey(date);
            const timings = data[timingKey];

            if (timings && timings.toLowerCase() !== 'closed') {
                const timeSlots = generateTimeSlots(timings);
                // Filter out booked slots
                const availableSlots = timeSlots.filter((slot) => !bookedSlots.includes(slot));
                setAvailableTimes(availableSlots);
                setIsClosed(false);
            } else {
                setAvailableTimes([]);
                setIsClosed(true);
            }
            
            // Only reset slot and notify parent when date actually changes (not on first render)
            if (!isFirstRender.current) {
                setSelectedSlot('');
                selectDateTimeSlotHandle(date, '');
            } else {
                isFirstRender.current = false;
            }
        }
    // Only run when date, data or bookedSlots change
    }, [date, data, bookedSlots, selectDateTimeSlotHandle]);


    const dateTimeChangeHandle = (date: Date | null) => {
        if (date) {
            setDate(date);
        }
    }

    const selectSlotHandle = (val:string) => {
        setSelectedSlot(val);
        if (date) {
            selectDateTimeSlotHandle(date, val);
        }
    }

    if (!date) {
        return (
            <div className="flex flex-col sm:flex-row w-full gap-4 items-stretch">
                <div className="h-11 w-full sm:w-1/2 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-11 w-full sm:w-1/2 rounded-xl bg-gray-100 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row w-full gap-4 items-stretch">
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

            <div className="flex flex-col items-start w-full sm:w-1/2">
                <label className="text-sm font-semibold text-[#19192C] font-poppins mb-1.5">
                    Select Schedule Time
                </label>
                <select
                value={selectedSlot}
                onChange={(e)=>selectSlotHandle(e.target.value)}
                    className="w-full h-11 border border-gray-200 text-sm text-[#19192C] px-4 bg-white outline-none rounded-xl focus:ring-2 focus:ring-[#C1001F]/20 focus:border-[#C1001F] shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                    disabled={isClosed}
                >
                    {isClosed ? (
                        <option value="">Closed</option>
                    ) : (
                        availableTimes.length > 0 ? <> <option value=''>
                            Select Slot
                        </option> {

                                availableTimes.map((time, index) => (
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))
                            }</> : (
                            <option value="">No available times</option>
                        )
                    )}
                </select>
            </div>
        </div>
    )
}

export default ScheduleDateTime;

