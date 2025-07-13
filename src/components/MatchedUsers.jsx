"use client";
import { getUserMatches } from '@/actions/user.actions';
import useFetch from '@/hooks/useFetch'
import React, { useEffect } from 'react'
import MatchedTable from './MatchedTable';
import { useMatch } from '@/context/MatchContext';
import ShortListedTable from './ShortListedTable';

const MatchedUsers = ({ user }) => {

    const { matches, setMatches, removeShortListed, addShortListed, shortListed } = useMatch();
    const { loading, data, error, fn } = useFetch(getUserMatches);

    const getUsers = async () => {
        await fn();
    }

    useEffect(() => {
        if (user) {
            getUsers();
        }
    }, [user])

    useEffect(() => {
        if (!loading && data) {
            setMatches(data.data)
        }
    }, [loading, data])

    return (
        <div className='p-5 space-y-5'>

            <div className='lg:mt-0 lg:text-xl font-medium'>
                <h1>Matched Users</h1>
                <MatchedTable loading={loading} shortListed={shortListed} addShortListed={addShortListed} matchedUsersData={matches} />
            </div>

            <div className='mt-10 lg:text-xl font-medium'>
                <h1>Shortlisted Users</h1>
                <ShortListedTable removeShortListed={removeShortListed} matchedUsersData={shortListed} />
            </div>
        </div>
    )
}

export default MatchedUsers