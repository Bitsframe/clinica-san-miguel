import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

export function useVapiInstance() {
  const vapi = useRef<any>(null);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_CLINIC_VAPI_PUBLIC_KEY;
    if (!apiKey) return;
    if (!vapi.current) {
      vapi.current = new Vapi(apiKey);
      setVapiInstance(vapi.current);
    }
    return () => {
      if (vapi.current) vapi.current.stop();
    };
  }, []);
  return vapiInstance;
}
