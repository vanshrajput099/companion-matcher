"use client";
import React, { useEffect, useState } from 'react';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { Loader2, LogOutIcon } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { logoutUser } from '@/actions/user.actions';
import { toast } from 'sonner';
import UsernameSearch from './UsernameSearch';
import { useMatch } from '@/context/MatchContext';

const RightComponent = ({ user, setUser }) => {

    const { resetMatches } = useMatch();
    const [isLogin, setIsLogin] = useState(false);
    const { loading, fn, error, data } = useFetch(logoutUser);

    const logoutUserFunction = async (e) => {
        e.preventDefault();
        await fn();
        resetMatches();
    }

    useEffect(() => {
        if (!loading && data) {
            toast(data.message);
            setUser(null);
        }
    }, [loading, data])

    return (
        <div className='lg:pt-10 flex flex-col lg:flex-row w-full justify-between items-start gap-10'>
            <div className='w-full sm:w-[55%] mx-auto lg:w-[35%] lg:mx-0'>
                {
                    !user ?
                        <>
                            <div className='border border-[#2a2a2a] p-2 lg:p-5 space-y-5 rounded-xl bg-[#1a1a1a]'>
                                <div className='flex justify-between text-lg lg:text-xl py-2 w-[80%] mx-auto'>
                                    <span onClick={() => setIsLogin(false)} className={`${!isLogin && "text-[#a855f7]"} font-medium cursor-pointer border-b-1 py-2`}>Register</span>
                                    <span onClick={() => setIsLogin(true)} className={`${isLogin && "text-[#a855f7]"} font-medium cursor-pointer border-b-1 py-2`}>Login</span>
                                </div>
                                <div className='p-2'>
                                    {
                                        isLogin ? <Login setUser={setUser} /> : <Register setIsLogin={setIsLogin} />
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className='space-y-2 flex flex-col items-center lg:block'>
                                <h1 className='text-3xl font-medium'>Hi {user.name}</h1>
                                <div onClick={logoutUserFunction} className={`p-3 flex w-fit gap-3 rounded-sm ${loading ? "bg-red-700" : "bg-red-500"} hover:bg-red-700 cursor-pointer`}>
                                    <h1>{loading ? <div className='flex gap-2'>Logging Out... <Loader2 className='animate-spin' /></div> : <>Log Out</>}</h1>
                                    <LogOutIcon />
                                </div>
                            </div>
                        </>
                }
            </div>
            <div className='w-full sm:w-[55%] mx-auto lg:w-[35%] lg:mx-0'>
                <UsernameSearch />
            </div>
        </div>

    )
}

export default RightComponent