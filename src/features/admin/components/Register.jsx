import React, { useState } from 'react'
import axios from '../../../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, email, password, role);
        try {
            const response = await axios.post("/api/auth/register", { name, email, password, role });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className='custom-bg-white mt-8'>
            <h2 className='mb-6 font-semibold'>تسجيل مستخدم جديد</h2>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 items-end md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8'>
                    <div>
                        <label htmlFor="name" className='custom-label-field'>الاسم</label>
                        <input type="text" id="name" placeholder="اكتب اسم المستخدم" value={name} onChange={(e) => setName(e.target.value)} className='custom-input-field' />
                    </div>
                    <div>
                        <label htmlFor="email" className='custom-label-field'>الإيميل الكتروني</label>
                        <input type="email" id="email" placeholder="اكتب ايميل الكتروني للمستخدم" value={email} onChange={(e) => setEmail(e.target.value)} className='custom-input-field' />
                    </div>
                    <div>
                        <label htmlFor="password" className='custom-label-field'>الرقم سري</label>
                        <input type="password" id="password" placeholder="اكنب رقم سري للمستخدم" value={password} onChange={(e) => setPassword(e.target.value)} className='custom-input-field' />
                    </div>
                    <div>
                        <select
                            id="role" name='role' value={role} onChange={(e) => setRole(e.target.value)}
                            className="custom-input-field"
                        >
                            <option value="employee">موظف</option>
                            <option value="admin">مسؤل</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className='min-w-60 py-2 px-6 bg-indigo-500 text-white rounded-lg shadow-sm duration-500 hover:bg-indigo-600 mx-auto block'>تسجيل</button>
            </form>
        </div>
    )
}

export default Register