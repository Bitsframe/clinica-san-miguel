import { useEffect, useState } from "react"

export function useVapiSpeaking(vapi: any) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (!vapi) return

    const handler = (msg: any) => {
      if (msg.type === "speech-update") {
        if (msg.status === "started") setIsSpeaking(true)
        if (["ended", "stopped", "completed", "idle", "not-speaking"].includes(msg.status)) setIsSpeaking(false)
      }
      // Defensive: if assistant says anything else, always stop on call-end
      if (msg.type === "call-end" || msg.type === "end" || msg.type === "call-stopped") {
        setIsSpeaking(false)
      }
    }

    vapi.on("message", handler)

    // Defensive: always set to false on unmount
    return () => {
      setIsSpeaking(false)
      vapi.off("message", handler)
    }
  }, [vapi])

  return isSpeaking
}
