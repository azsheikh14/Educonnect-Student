'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';

const socket = io(process.env.NEXT_PUBLIC_API_URL!);

const ConfirmClass = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('classId');
    const [isConfirming, setIsConfirming] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [linkExpired, setLinkExpired] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const confirmClass = async () => {
                setIsLoading(true);
                setHasError(false);
                setLinkExpired(false);

                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/confirm-class/${id}`);
                    toast.success(response.data.message);
                    setIsConfirming(false);

                    if (socket) {
                        const message = `
                            <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                                <h3 style="margin: 0;">Class Confirmation</h3>
                                <p>Your demo class has been confirmed by the student.</p>
                                <p><strong>Class ID:</strong> ${response.data.updatedClass._id}</p>
                                <p><strong>Slot:</strong> ${response.data.updatedClass.slot.day} ${response.data.updatedClass.slot.slot}</p>
                                <div style="margin-top: 40px;">
                                    <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/class-details?classId=${response.data.updatedClass._id}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">View Class Details</a>
                                </div>
                            </div>
                        `;

                        const messageData = { senderId: response.data.updatedClass.studentId, receiverId: response.data.updatedClass.teacherId, text: message, timestamp: new Date() };

                        socket.emit('sendMessage', messageData);
                    }

                    setTimeout(() => {
                        router.push('/classes');
                    }, 3000);
                } catch (error) {
                    let errorMessage = 'An error occurred';
                    if (axios.isAxiosError(error) && error.response) {
                        const { status } = error.response;
                        errorMessage = error.response.data?.message || errorMessage;

                        if (status === 400) {
                            setHasError(true);
                            toast.error(errorMessage);
                            setIsConfirming(false);
                            setTimeout(() => {
                                router.push('/classes');
                            }, 3000);
                        } else if (status === 405) {
                            setLinkExpired(true);
                            setIsConfirming(false);
                            toast.error("Link expired! Redirecting...");
                            setTimeout(() => {
                                router.push('/classes');
                            }, 3000);
                        }
                    } else {
                        toast.error(errorMessage);
                        setHasError(true);
                    }
                } finally {
                    setIsLoading(false);
                }
            };

            if (id) {
                confirmClass();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [id, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="rounded-lg p-6 max-w-sm w-full text-center">
                <h1 className="text-xl font-bold mb-4">Confirming Your Class...</h1>
                <div className="flex flex-col items-center">
                    {isLoading ? (
                        <>
                            <img src="/loadingSpinner.gif" alt="Loading..." className="mb-4 h-14" />
                            <p className="text-gray-600">Loading, please wait...</p>
                        </>
                    ) : hasError ? (
                        <>
                            <img src="/errorConfirm.png" alt="Error confirming class" className="mb-4 h-14" />
                            <p className="text-blue-600">The class is already confirmed! Redirecting</p>
                        </>
                    ) : linkExpired ? (
                        <>
                            <img src="/errorConfirm.png" alt="Link expired" className="mb-4 h-14" />
                            <p className="text-red-600">The link has expired! Redirecting...</p>
                        </>
                    ) : isConfirming ? (
                        <>
                            <img src="/waitConfirm.png" alt="Waiting for confirmation" className="mb-4 h-14" />
                            <p className="text-gray-600">Please wait a moment while we confirm your class.</p>
                        </>
                    ) : (
                        <>
                            <img src="/confirmed.png" alt="Class confirmed" className="mb-4 h-14" />
                            <p className="text-green-600">Your class has been confirmed! Redirecting...</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmClass;
