import React from 'react'

function Status() {
  return (
    <div className="bg-feed min-w-[300px] max-w-[420px]">
      <h2 className="text-white mx-4 my-5 font-extrabold text-xl">Active Now</h2>
      <div>
        <p className="text-center text-white font-bold">It's quiet for now...</p>
        <p className="text-[14px] text-gray text-center px-3">When a friend starts an activity-like playing a game of hanging out on voice-we'll show it here!</p>
      </div>
    </div>
  )
}

export default Status;