"use client";
import { useState } from 'react'
import { toast } from 'sonner';

const useFetch = (fun) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fn = async (...args) => {
        try {
            setLoading(true);
            const res = await fun(...args);

            console.log(res)

            if (res.statusCode >= 400) {
                toast(res.message);
                setError(res.message);
                return;
            }

            setData(res);
        } catch (error) {
            setError(error.message);
            toast.error("Unexpected error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, data, error, fn };
}

export default useFetch