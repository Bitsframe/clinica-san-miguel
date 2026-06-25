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
    (async () => {
      const tableName = locale === "es" ? "Tickers_es" : "Tickers";
      const { data } = await supabase.from(tableName).select("*");

      if (data) {
        setTickers(data.map((item) => item.text));
      }
    })();
  }, [locale]);



  return (
    tickers.length ? <TextSlider texts={tickers} /> : <></>
  )
}
export default RenderTicker