import React, { useState, useRef } from 'react'
import { axiosAuth } from '../../../api/axios';
import { Toaster } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { Users, Trash } from 'lucide-react'
import { useApp } from '../../../context/AppContext';
import { A_DeleteConfirmModal } from '.';
import Loading from '../../../shared/components/Loading';

const Register = () => {
    const { isDelete, setIsDelete, successNotify, deleteNotify, errorNotify } = useApp();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const formRef = useRef(null); // Ref for scrolling

    const handleRegisterUser = async (values, actions) => {
        if (selectedUser) {
            // Update an existing user
            try {
                // If the request succeeds, proceed with updating the user
                await axiosAuth.put(`/users/${selectedUser._id}`, values);

                successNotify(`${values.userName} تم تعديل بيانات المستخدم:`);
                getAllUsers();
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    errorNotify(`اسم المستخدم ${values.userName} موجود بالفعل.`);
                } else {
                    console.error(error);
                }
                return; // Stop execution if email exists or other errors occur
            }

            setSelectedUser(null);
            actions.resetForm();

        } else {
            try {
                await axiosAuth.post('/helpers/checkemail', { email: values.userName });

                // If the request succeeds, the email does not exist, so we proceed
                await axiosAuth.post('/users', values);
                successNotify(`${values.userName} تم تسجيله كمستخدم جديد.`);
                getAllUsers();
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        errorNotify(`اسم المستخدم ${values.userName} موجود بالفعل.`);
                    } else if (error.response.status === 403) {
                        errorNotify("ليس لديك صلاحية لإضافة مستخدم جديد.");
                    }
                } else {
                    console.error(error);
                }
                return; // Stop execution if email exists or other errors occur
            }

            actions.resetForm();
        }


    }

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosAuth.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
            await axiosAuth.delete(`/users/${userID}`);
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


    if (loading) return <Loading />

    return (
        <div className='lg:grid grid-cols-2 gap-6'>
            <div className='custom-bg-white max-h-84 mt-8 overflow-y-auto scrollbar'>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <Users />
                    <h2 className='font-bold'>قائمة المستخدمين</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
                {users && users.length > 0 ? (
                    <div className='flex flex-col gap-4 items-center'>
                        {users.map(user => {
                            return (
                                <div key={user._id} className='w-full flex items-center justify-between border-b border-gray-300 pb-6'>
                                    <div className='flex gap-6'>
                                        <p className='text-center lg:min-w-30'>{user.userName}</p>
                                        <div>{user.userRole === 'admin' ? (
                                            <p className='font-semibold text-indigo-400 text-center'>مسؤل</p>
                                        ) : (
                                            <p className='text-gray-700 text-center'>موظف</p>
                                        )}
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className='cursor-pointer duration-500 hover:text-indigo-500 hover:rotate-45' onClick={() => handleEditClick(user)}>
                                            <FaRegEdit className="w-5 h-5" />
                                        </div>
                                        <div className='cursor-pointer duration-500 hover:text-red-500 hover:rotate-45 rounded-b-lg' onClick={() => setIsDelete({ purpose: 'one-user', itemId: user._id, itemName: user.userName })}>
                                            <Trash className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className='text-center'>
                        <p>القائمة فارغة, الرجاء إضافة مستخدمين.</p>
                    </div>
                )}
            </div>


            {isDelete.purpose === 'one-user' && (
                <A_DeleteConfirmModal itemName={isDelete.itemName} deleteFun={() => handleDeleteUser(isDelete.itemId)} setIsDelete={setIsDelete} />
            )}

            <div className='custom-bg-white max-h-max mt-8' ref={formRef}>
                <div className='relative max-w-max flex items-center justify-center gap-2 mb-8 mx-auto'>
                    <Users />
                    <h2 className='font-bold'>تسجيل مستخدم جديد</h2>
                    <span className='absolute -bottom-1 right-0 w-[60%] h-[2px] bg-indigo-200 rounded-sm'></span>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        userName: selectedUser ? selectedUser.userName : "",
                        password: "",
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
                            <div className='relative'>
                                    <label htmlFor="userName" className='custom-label-field'>الاسم</label>
                                    <Field type="text" name="userName" id="userName" placeholder="اكتب اسم المستخدم"
                                        autoComplete="new-password" className='custom-input-field' />
                                    <ErrorMessage name="userName" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                </div>
                                <div className='relative'>
                                    <label htmlFor="password" className='custom-label-field'>الرقم سري</label>
                                    <Field type="password" name="password" id="password" placeholder="اكنب رقم سري للمستخدم"
                                        autoComplete="new-password" className='custom-input-field' />
                                    <ErrorMessage name="password" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                </div>
                                <div className='relative'>
                                    <Field as="select" name='role' className='custom-input-field' >
                                        <option value="user">موظف</option>
                                        <option value="admin">مسؤل</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="text-red-400 text-xs absolute -bottom-5 right-1" />
                                </div>
                            </div>
                            <button type="submit" name='add-user-btn' className={`w-full md:w-auto md:min-w-60 py-2 px-6 text-white rounded-lg shadow-sm duration-500 mx-auto block ${selectedUser ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
                                {selectedUser ? "تحديث البيانات" : "تسجيل جديد"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <Toaster toastOptions={{ duration: 3000 }} />
            </div>
        </div>
    )
}

export default Register