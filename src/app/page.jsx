"use client";
import MatchedUsers from "@/components/MatchedUsers"
import RightComponent from "@/components/RightComponent"
import { useState } from "react";

const page = () => {

  const [user, setUser] = useState(null);

  return (
    <div className='bg-black text-white'>
      <div className='bg-black w-full'>
        <div className="w-[90%] lg:min-h-[80vh] mx-auto flex flex-col items-center gap-10 p-5 lg:p-10">
          <div className='space-y-4 flex flex-col justify-center text-center'>
            <h1 className='text-3xl sm:text-4xl lg:text-6xl font-bold'>Companion Matcher</h1>
            <p>Intern Project Made Using Next.js</p>
          </div>
          <RightComponent user={user} setUser={setUser} />
        </div>
      </div>

      <div className="w-full min-h-[15vh] bg-[#111111]">
        <div className="w-full mx-auto">
          <MatchedUsers user={user}/>
        </div>
      </div>

    </div>
  )
}

export default page