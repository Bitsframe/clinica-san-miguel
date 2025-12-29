import { useEffect, useState } from "react"

export function useVapiUserSpeaking(vapi: any) {
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)

  useEffect(() => {
    if (!vapi) return

    const handler = (msg: any) => {
      // Debug log all user-related events
      if (msg.role === "user") {
        console.log('[USER SPEAKING HOOK EVENT]', msg);
      }
      // Support both speech-update and transcript events for user speaking
      if ((msg.type === "speech-update" && msg.role === "user" && msg.status === "started") ||
          (msg.type === "transcript" && msg.role === "user" && msg.transcriptType !== "final")) {
        console.log('[USER SPEAKING HOOK] setIsUserSpeaking(true)', msg);
        setIsUserSpeaking(true)
      }
      if ((msg.type === "speech-update" && msg.role === "user" && ["ended", "stopped", "completed", "idle", "not-speaking"].includes(msg.status)) ||
          (msg.type === "transcript" && msg.role === "user" && msg.transcriptType === "final")) {
        console.log('[USER SPEAKING HOOK] setIsUserSpeaking(false)', msg);
        setIsUserSpeaking(false)
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
