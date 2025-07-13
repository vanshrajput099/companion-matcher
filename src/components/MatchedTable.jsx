import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'

const MatchedTable = ({ matchedUsersData, addShortListed, shortListed, loading }) => {

    if (loading) {
        return <h1 className='flex gap-2 items-center text-2xl mt-5'>Loading... <Loader2 className='animate-spin' /></h1>
    }

    return (
        <div className='lg:mt-2 p-2'>
            {
                matchedUsersData.length === 0 ?
                    <h1 className='text-lg'>No Data....</h1>
                    :
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-5 gap-x-5 mt-5 ">
                            {
                                matchedUsersData.map((ele, idx) => (
                                    <div key={idx} className="border border-[#2a2a2a] p-4 rounded-lg shadow text-sm bg-[#1a1a1a]  h-full flex flex-col justify-between">
                                        <div className='flex justify-between'>
                                            <p>Username:</p>
                                            <p>{ele.username}</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <p>Name:</p>
                                            <p>{ele.name}</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <p>Age:</p>
                                            <p>{ele.age}</p>
                                        </div>
                                        <div className="mt-2">
                                            <span className="font-semibold">Interests:</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {ele.interests.map((interest, i) => (
                                                    <span key={i} className="px-2 py-1 bg-[#a855f7] rounded">
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {
                                            shortListed.some((user) => user.username === ele.username) ?
                                                <Button className={'mt-5 w-fit bg-[#ef4444] text-white'}>Shortlisted</Button>
                                                :
                                                <Button onClick={() => { addShortListed(ele) }} className={'mt-5 w-fit bg-[#10b981] text-white'}>Shortlist</Button>
                                        }

                                    </div>
                                ))}
                        </div>

                    </>
            }
        </div>
    )
}

export default MatchedTable