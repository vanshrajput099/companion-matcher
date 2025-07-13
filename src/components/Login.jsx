"use client";
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import useFetch from '@/hooks/useFetch';
import { loginUser } from '@/actions/user.actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        username: "", password: ""
    });

    const { loading, fn, error, data } = useFetch(loginUser);

    const validateForm = () => {
        const { username, password } = formData;

        if (!username.trim()) {
            toast.error("Username is required");
            return false;
        }

        if (!password.trim()) {
            toast.error("Password is required");
            return false;
        }

        return true;
    };

    const loginUserFunction = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        await fn(formData);
    };

    const setDataInForm = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        if (!loading && data) {
            toast.success(data.message);
            setFormData({ username: "", password: "" });
            setUser(data.data);
        }
    }, [loading, data]);

    return (
        <div className='w-full mx-auto h-fit'>
            <form className='space-y-5'>
                <Input
                    onChange={setDataInForm}
                    value={formData.username}
                    name="username"
                    placeholder="Enter your username"
                    className='bg-white placeholder:text-black text-black text-xs lg:text-base'
                />
                <Input
                    onChange={setDataInForm}
                    value={formData.password}
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className='bg-white placeholder:text-black text-black text-xs lg:text-base'
                />
                <Button disabled={loading} onClick={loginUserFunction} className='w-full bg-[#a855f7] hover:bg-purple-800'>
                    {
                        loading ? (
                            <div className='flex gap-2'>
                                Logging in
                                <Loader2 className='animate-spin' />
                            </div>
                        ) : <>Login</>
                    }
                </Button>
            </form>
        </div>
    )
}

export default Login;
