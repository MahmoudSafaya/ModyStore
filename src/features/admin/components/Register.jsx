import React, { useState, useRef } from 'react'
import axios from '../../../api/axios';
import { Toaster } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { Users } from 'lucide-react'
import { useApp } from '../../../context/AppContext';
import { A_DeleteConfirmModal } from '.';

const Register = () => {
    const { isDelete, setIsDelete, successNotify, deleteNotify } = useApp();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const formRef = useRef(null); // Ref for scrolling

    const handleRegisterUser = async (values, actions) => {
        if (selectedUser) {
            console.log('in update')
            console.log(values)
            // Update a new user
            try {
                await axios.put(`/users/${selectedUser._id}`, values);

                successNotify(`${values.userName} تم تعديل بيانات المستخدم:`)
                getAllUsers();
            } catch (error) {
                console.log(error);
            }

        } else {
            // Create a new user
            try {
                const res = await axios.post('/users', values);
                console.log(res);
                successNotify(`${values.userName} تم تسجيله كمستخدم جديد.`);
                getAllUsers();
            } catch (error) {
                console.log(error);
            }
        }
        setSelectedUser(null);
        actions.resetForm();
    }

    const getAllUsers = async () => {
        console.log('in users');
        try {
            const res = await axios.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to form
        }, 100);
    };

    const handleDeleteUser = async (userID) => {
        try {
            const res = await axios.delete(`/users/${userID}`);
            console.log(res);
            setIsDelete({ purpose: '', itemId: '', itemName: '' });
            const remainUsers = users.filter(user => user._id !== userID);
            setUsers(remainUsers);
            deleteNotify('تم حذف المستخدم بنجاح.');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div>
            <div className='custom-bg-white mt-8'>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <Users />
                    <h2 className='font-bold'>قائمة المستخدمين</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
                {users && users.length > 0 ? (
                    <div className='flex flex-col gap-4 items-center'>
                        {users.map(user => {
                            return (
                                <div key={user._id} className='w-full flex items-center justify-between border-b border-gray-300 pb-4'>
                                    <p className='min-w-40 text-center'>{user.userName}</p>
                                    <div className='min-w-40'>{user.userRole === 'admin' ? (
                                        <p className='font-semibold text-indigo-400 text-center'>admin</p>
                                    ) : (
                                        <p className='text-gray-700 text-center'>user</p>
                                    )}</div>
                                    <div className='flex flex-col md:flex-row gap-6'>
                                        <button className="w-30 py-2 px-4 bg-gray-600 text-white shadow-sm rounded-lg duration-500 hover:bg-gray-700" onClick={() => handleEditClick(user)}>تعديل</button>
                                        <button className="w-30 py-2 px-4 bg-red-500 text-white shadow-sm rounded-lg duration-500 hover:bg-red-600" onClick={() => setIsDelete({ purpose: 'one-user', itemId: user._id, itemName: user.userName })}>حذف</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>

            {isDelete.purpose === 'one-user' && (
                <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={() => handleDeleteUser(isDelete.itemId)} setIsDelete={setIsDelete} />
            )}

            <div className='custom-bg-white mt-8' ref={formRef}>
                <h2 className='mb-6 font-semibold'>تسجيل مستخدم جديد</h2>
                <Formik
                    enableReinitialize
                    initialValues={{
                        userName: selectedUser ? selectedUser.userName : "",
                        password: selectedUser ? selectedUser.password : "",
                        role: selectedUser ? selectedUser.userRole : "user",
                    }}
                    validationSchema={Yup.object().shape({
                        userName: Yup.string()
                            .min(3, "الاسم يجب أن يكون على الأقل 3 أحرف")
                            .required("الاسم مطلوب"),
                        password: Yup.string()
                            .min(6, "يجب أن يكون الرقم السري على الأقل 6 أحرف").required("الرقم السري مطلوب"),
                        role: Yup.string().required("الدور مطلوب"),
                    })}
                    onSubmit={handleRegisterUser}
                >
                    {({ values, isSubmitting }) => (
                        <Form>
                            <div className='grid grid-cols-1 items-end md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8'>
                                <div>
                                    <label htmlFor="userName" className='custom-label-field'>الاسم</label>
                                    <Field type="text" name="userName" id="userName" placeholder="اكتب اسم المستخدم" className='custom-input-field' />
                                    <ErrorMessage name="userName" component="div" className="text-red-400" />
                                </div>
                                <div>
                                    <label htmlFor="password" className='custom-label-field'>الرقم سري</label>
                                    <Field type="password" name="password" id="password" placeholder="اكنب رقم سري للمستخدم" className='custom-input-field' />
                                    <ErrorMessage name="password" component="div" className="text-red-400" />
                                </div>
                                <div>
                                    <Field as="select" name='role' className='custom-input-field' >
                                        <option value="user">موظف</option>
                                        <option value="admin">مسؤل</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="text-red-400" />
                                </div>
                            </div>
                            <button type="submit" className={`min-w-60 py-2 px-6 text-white rounded-lg shadow-sm duration-500 mx-auto block ${selectedUser ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
                                {selectedUser ? "تحديث البيانات" : "تسجيل جديد"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <Toaster toastOptions={{ duration: 7000 }} />
            </div>
        </div>
    )
}

export default Register