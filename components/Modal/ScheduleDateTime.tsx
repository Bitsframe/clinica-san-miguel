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
        const [date, setDate] = useState<Date>(initialDate || new Date());
        const [availableTimes, setAvailableTimes] = useState<string[]>([]);
        const [isClosed, setIsClosed] = useState<boolean>(false);
        const [selectedSlot, setSelectedSlot] = useState(initialSlot || '');
        const [bookedSlots, setBookedSlots] = useState<string[]>([]);
        const isFirstRender = useRef(true);

    const getTimingKey = (date: Date): keyof DayTimings => {
        const days = ['sunday_timing', 'mon_timing', 'tuesday_timing', 'wednesday_timing', 'thursday_timing', 'friday_timing', 'saturday_timing'] as const;
        return days[date.getDay()];
    };

    const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return { hours, minutes };
    };

    const generateTimeSlots = (timing: string) => {
        const [start, end] = timing.split('-').map(str => str.trim());
        let timeSlots = [];
        let startHour = parseInt(start.split(':')[0]);
        let endHour = parseInt(end.split(':')[0]);

        // Convert 12-hour time format to 24-hour format for comparison
        if (start.includes("pm") && startHour !== 12) startHour += 12;
        if (end.includes("pm") && endHour !== 12) endHour += 12;
        if (start.includes("am") && startHour === 12) startHour = 0;
        if (end.includes("am") && endHour === 12) endHour = 0;

        // Generate slots from start to one hour before end (endHour - 1)
        for (let hour = startHour; hour < endHour; hour++) {
            let period = hour < 12 || hour === 24 ? 'AM' : 'PM';
            let formattedHour = hour % 12 === 0 ? 12 : hour % 12;
            let timeSlot = `${formattedHour}:00 ${period}`;
            timeSlots.push(timeSlot);
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
                        console.error('Error fetching booked slots:', error);
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
                } catch (err) {
                    console.error('Error in fetchBookedSlots:', err);
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
    }, [date, data, bookedSlots]);


    const dateTimeChangeHandle = (date: Date | null) => {
        if (date) {
            setDate(date);
        }
    }

    const selectSlotHandle = (val:string) => {
        setSelectedSlot(val);
        selectDateTimeSlotHandle(date, val);
    }

    return (
        <div className="flex flex-col sm:flex-row justify-center w-full gap-3 sm:gap-5 items-stretch">
            <div className="flex flex-col items-start w-full sm:w-1/2 justify-center">
                <label className="text-xs sm:text-sm md:text-[16px] text-customGray font-poppins font-bold mb-1">
                    Select Schedule Date:
                </label>
                {/* @ts-ignore */}
                <ReactDatePicker
                    minDate={new Date()}
                    selected={date}
                    onChange={dateTimeChangeHandle}
                    placeholderText={"Select Schedule date"}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom-start"
                    className="w-full h-[44px] sm:h-[46px] border-[1px] border-[#d1d5db] text-sm sm:text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-3 sm:px-5 bg-transparent outline-none rounded-[10px]"
                />
            </div>

            <div className="flex flex-col items-start w-full sm:w-1/2 justify-center">
                <label className="text-xs sm:text-sm md:text-[16px] text-customGray font-poppins font-bold mb-1">
                    Select Schedule Time:
                </label>
                <select
                value={selectedSlot}
                onChange={(e)=>selectSlotHandle(e.target.value)}
                    className='w-full h-[44px] sm:h-[46px] border-[1px] border-[#d1d5db] text-sm sm:text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-3 sm:px-5 bg-transparent outline-none rounded-[10px]'
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

