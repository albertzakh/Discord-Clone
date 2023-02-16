import React from 'react'

function Status() {
  return (
    <div className="flex-1 bg-feed p-3">
      <h2 className="text-white font-bold text-xl ">Active Now</h2>
      <div>
        <p className="text-center mt-6 text-white font-bold">It's quiet for now...</p>
        <p className="text-[13px] text-gray text-center">When a friend starts an activity-like playing a game of hanging out on voice-we'll show it here!</p>
      </div>
    </div>
  )
}

export default Status