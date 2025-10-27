'use client'

import Self_Appointment from '@/components/CSAForm'
import { supabase } from '@/supabaseClient'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const SelfAppointmentForm = () => {

  const { location_id } = useParams()
  const [checkingLocation, setCheckingLocation] = useState<boolean>(true)
  const [location, setLocation] = useState<any>(null)

  console.log(location_id)


  useEffect(() => {
    // Check if location_id is a valid number
    if (isNaN(Number(location_id))) {
      console.error("Invalid location ID:", location_id);
      setCheckingLocation(false)
      return;
    }

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('Locations')
          .select("*")
          .eq('id', Number(location_id)); // Convert to number here

        if (error) throw error;
        if (data) {
          setLocation(data[0]);
          setCheckingLocation(false)
        }
      } catch (error: any) {
        setCheckingLocation(false)
        console.error("Error fetching services:", error.message);
      }
      finally{
        setCheckingLocation(false)
      }
    };

    if (location_id) fetchServices();
  }, [location_id]);


  if (checkingLocation) {
    return <div className='h-screen w-full flex justify-center items-center'>
      <p>Checking location....</p>

    </div>
  }



  if (!checkingLocation && location) {
    return (
      <Self_Appointment location={location} />
    )
  }


  if (!checkingLocation && !location) {

    return <div className='h-screen w-full flex justify-center items-center'>
      <p className='text-red-700'>Invalid Location code</p>

    </div>

  }






}

export default SelfAppointmentForm
