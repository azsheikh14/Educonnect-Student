'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmClass = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('classId');
    const [isConfirming, setIsConfirming] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const confirmClass = async () => {
                setIsLoading(true);
                setHasError(false);

                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/confirm-class/${id}`);
                    toast.success(response.data.message);
                    setIsConfirming(false);
                } catch (error) {
                    let errorMessage = 'An error occurred';
                    if (axios.isAxiosError(error) && error.response) {
                        errorMessage = error.response.data?.message || errorMessage;
                    }
                    toast.error(errorMessage);
                    setHasError(true);
                } finally {
                    setIsLoading(false);
                }
            };

            if (id) {
                confirmClass();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [id]);

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
                            <p className="text-red-600">There was an error confirming your class. Please try again.</p>
                        </>
                    ) : isConfirming ? (
                        <>
                            <img src="/waitConfirm.png" alt="Waiting for confirmation" className="mb-4 h-14" />
                            <p className="text-gray-600">Please wait a moment while we confirm your class.</p>
                        </>
                    ) : (
                        <>
                            <img src="/confirmed.png" alt="Class confirmed" className="mb-4 h-14" />
                            <p className="text-green-600">Your class has been confirmed!</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmClass;
