import React from 'react'
import SpinnerLogo from "../img/spinner.gif";

function LoadingSpinner() {
  return (
    <div className="bg-[#24232a] text-[#898a8e] flex flex-col items-center justify-center absolute w-screen h-screen">
        <img src={SpinnerLogo} className="w-40 h-40" />
        <strong className="text-inviteBtn">Fetching Messages</strong>
        <p>Please wait for Discord to fetch messages</p>
    </div>
  )
}

export default LoadingSpinner;