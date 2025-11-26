"use client"

import { useSession } from "next-auth/react"

export default function Notifications() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <div className="w-full pt-10 pb-32 px-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div className="mb-12 flex flex-col items-start w-full">
        <h1 className="text-6xl font-display font-black text-white mb-2 tracking-tighter">
          Notifications
        </h1>
        <p className="text-gray-500 text-xl font-medium">
          Stay updated with the latest signals.
        </p>
      </div>

      <div className="w-full flex flex-col gap-6 pb-20">
        <div className="p-10 border border-white/10 bg-[#121214] rounded-3xl text-left">
          <h2 className="text-xl font-display font-bold text-white mb-2">No notifications yet.</h2>
          <p className="text-gray-500">You're all caught up.</p>
        </div>
      </div>
    </div>
  )
}
