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

            if (res.statusCode >= 400) {
                toast(res.message);
                setData(null);
                setError(res.message);
                return;
            }

            setData(res);
            setError(null);
        } catch (error) {
            setError(error.message);
            setData(null);
            toast.error("Unexpected error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, data, error, fn };
}

export default useFetch