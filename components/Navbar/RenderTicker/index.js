'use client'
import React, { useEffect, useState } from 'react'
import TextSlider from "@/components/Navbar/RenderTicker/TextSlider";
import { usePathname } from "@/navigation";
import { useLocale } from 'next-intl';
import { supabase } from '@/supabaseClient';


const RenderTicker = () => {

  const locale = useLocale();
  const [tickers, setTickers] = useState([])




  useEffect(() => {
    ; (async () => {
      console.log('iscalled')


      let { data, error } = await supabase
        .from(`Tickers${locale !== 'en' ? '_es' : ''} `)
        .select('*')

        if (data) {
        const ticker_text = data.map((item) => item.text);
        setTickers(ticker_text);
      }
    })()

  }, [,locale]);



  return (
    tickers.length ? <TextSlider texts={tickers} /> : <></>
  )
}
export default RenderTicker