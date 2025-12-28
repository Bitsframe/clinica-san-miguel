import { useEffect, useState } from "react"

export function useVapiUserSpeaking(vapi: any) {
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)

  useEffect(() => {
    if (!vapi) return

    const handler = (msg: any) => {
      if (msg.type === "speech-update" && msg.role === "user") {
        if (msg.status === "started") setIsUserSpeaking(true)
        if (["ended", "stopped", "completed", "idle", "not-speaking"].includes(msg.status)) setIsUserSpeaking(false)
      }
      if (msg.type === "call-end" || msg.type === "end" || msg.type === "call-stopped") {
        setIsUserSpeaking(false)
      }
    }

    vapi.on("message", handler)
    return () => {
      setIsUserSpeaking(false)
      vapi.off("message", handler)
    }
  }, [vapi])

  return isUserSpeaking
}
