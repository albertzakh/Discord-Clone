import React from 'react'

function GroupDM({ username, profilePic, createdAt, text, showOnlyMessage, image }) {
  return (
    <>
    {showOnlyMessage ? (
        <p className="px-20 py-[2px] text-white text-[15px] break-all hover:bg-[#2e3035]">{text}</p>
    ) : (
      <div className="flex flex-row px-7 hover:bg-[#2e3035] py-1">
          <img className="w-10 h-10 object-cover rounded-full" src={profilePic} />
          <div className="ml-3 mt-[-3px]">
              <div><strong className="text-white text-[13px]">{username}</strong><span className="ml-3 text-gray text-[12px]">{createdAt}</span></div>
              <p className="text-white text-[15px] break-all">{text}</p>
              {image && (<img src={image} className="w-60 h-60 object-cover mt-3" />)}
          </div>
      </div>
    )}
      
    </>
    
  )
}

export default GroupDM;