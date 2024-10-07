import React from 'react'
import Leftdashboard from './leftdashboard'
function Sidebar({open, user}: {open: boolean, user: any}) {
  return (
    <div className={` md:hidden w-3/5 left-0  min-h-screen absolute top-[4rem] bg-white text-white p-4 z-[1000] ${open ? "block" : "hidden"}`}>
        <Leftdashboard user={user} />
    </div>
  )
}

export default Sidebar