import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import useFetch from '@/hooks/useFetch';
import { Button } from './ui/button';
import { searchUsingUsername } from '@/actions/user.actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useMatch } from '@/context/MatchContext';

const UsernameSearch = () => {

    const { matches, setMatches, shortListed, resetMatches } = useMatch();
    const [username, setUsername] = useState("");
    const { loading, fn, error, data } = useFetch(searchUsingUsername);

    const searchFunction = async (e) => {
        e.preventDefault();
        resetMatches();
        if (username.trim() === "") {
            toast("Username is required");
            return;
        }
        await fn(username);
    }

    useEffect(() => {
        if (!loading && data) {
            toast(data.message);
            setMatches(data.data);
        }
    }, [loading, data])

    useEffect(() => {
        if (!loading && error) {
            resetMatches();
        }
    }, [loading, error])

    return (
        <div>
            <form className='border border-[#2a2a2a] p-3 lg:p-5 space-y-5 rounded-xl bg-[#1a1a1a]'>
                <h1 className='text-xl lg:text-3xl font-semibold'>Match Username (Case Sensitive) </h1>
                <p>Some Examples - Julia31, Rudy45, Tammy9, Alfredo24</p>
                <Input
                    onChange={(e) => { setUsername(e.target.value) }}
                    value={username}
                    name="username"
                    placeholder="Enter your username"
                    className='bg-white placeholder:text-black text-black text-xs lg:text-base'
                />
                <Button disabled={loading} onClick={searchFunction} className='w-full bg-[#a855f7] hover:bg-purple-800'>
                    {
                        loading ? (
                            <div className='flex gap-2'>
                                Searching...
                                <Loader2 className='animate-spin' />
                            </div>
                        ) : <>Search</>
                    }
                </Button>
            </form>

            <div className='w-full p-2 rounded-lg flex flex-col lg:flex-row gap-5 mt-5 text-center'>
                <div className='lg:w-1/2 text-xl border-[#2a2a2a] bg-[#1a1a1a] p-2 rounded-lg space-y-3'>
                    <h1>Matches Found</h1>
                    <p className='font-semibold text-3xl'>{matches?.length || "-"}</p>
                </div>
                <div className='lg:w-1/2 text-xl border-[#2a2a2a] bg-[#1a1a1a] p-2 rounded-lg space-y-3'>
                    <h1>Shortlisted</h1>
                    <p className='font-semibold text-3xl'>{shortListed?.length || "-"}</p>
                </div>
            </div>
        </div>
    )
}

export default UsernameSearch