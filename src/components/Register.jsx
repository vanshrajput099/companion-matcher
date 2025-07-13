import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { interests } from '@/data';
import { Loader2, Trash2 } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { createUser } from '@/actions/user.actions';
import { toast } from 'sonner';

const Register = ({ setIsLogin }) => {

    const [selectValue, setSelectValue] = useState("");
    const [formData, setFormData] = useState({
        username: "", name: "", password: "", age: "", interests: []
    });

    const { data, error, fn, loading } = useFetch(createUser);

    const validateForm = () => {
        const { username, name, password, age, interests } = formData;

        if (!username.trim()) {
            toast.error("Username is required");
            return false;
        }

        if (!name.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!password.trim() || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }

        if (!age || isNaN(age) || parseInt(age) < 12) {
            toast.error("Valid age (12 or above) is required");
            return false;
        }

        if (interests.length < 2) {
            toast.error("Select at least 2 interests");
            return false;
        }

        return true;
    };

    const registerUser = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        await fn({ ...formData, age: parseInt(formData.age) }); // convert age from string to int
    };

    const setDataInForm = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addInterest = (value) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(value)
                ? prev.interests
                : [...prev.interests, value],
        }));
        setSelectValue("");
    };

    const removeInterest = (value) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.filter((ele) => ele !== value)
        }));
    };

    useEffect(() => {
        if (!loading && data) {
            toast.success(data.message);
            setFormData({ username: "", name: "", password: "", age: "", interests: [] });
            setIsLogin(true);
        }
    }, [loading, data]);

    return (
        <div className='w-full mx-auto h-fit'>
            <form className='space-y-5'>
                <Input
                    name="username"
                    value={formData.username}
                    onChange={setDataInForm}
                    placeholder="Enter your username"
                    className='bg-white placeholder:text-black text-black text-xs lg:text-base'
                />
                <Input
                    name="name"
                    value={formData.name}
                    onChange={setDataInForm}
                    placeholder="Enter your name"
                    className='bg-white placeholder:text-black text-black text-xs lg:text-base'
                />
                <Input
                    name="password"
                    type='password'
                    value={formData.password}
                    onChange={setDataInForm}
                    placeholder="Enter your password"
                    className='bg-white placeholder:text-black text-black text-xs lg:text-base'
                />
                <Input
                    name="age"
                    type='number'
                    value={formData.age}
                    onChange={setDataInForm}
                    placeholder="Enter your age"
                    className='bg-white placeholder:text-black text-black text-xs lg:text-base'
                />

                {formData.interests.length < 5 && (
                    <Select value={selectValue} onValueChange={addInterest}>
                        <SelectTrigger className="w-full bg-white text-black text-xs lg:text-base">
                            <SelectValue placeholder="Select your interest" />
                        </SelectTrigger>
                        <SelectContent>
                            {interests.map((ele, idx) => (
                                !formData.interests.includes(ele) && (
                                    <SelectItem key={idx} value={ele}>{ele}</SelectItem>
                                )
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {formData.interests.length !== 0 && (
                    <div className='flex flex-wrap gap-3 text-sm'>
                        {formData.interests.map((ele, idx) => (
                            <span key={idx} className='flex items-center border gap-2 px-3 py-1 bg-gray-300 text-black rounded-lg'>
                                {ele}
                                <Trash2 onClick={() => removeInterest(ele)} size={'16px'} className='text-red-600 hover:cursor-pointer' />
                            </span>
                        ))}
                    </div>
                )}

                <Button disabled={loading} onClick={registerUser} className='w-full bg-[#a855f7] hover:bg-purple-800'>
                    {loading ? (
                        <div className='flex gap-2'>
                            Registering
                            <Loader2 className='animate-spin' />
                        </div>
                    ) : (
                        <>Register</>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default Register;
