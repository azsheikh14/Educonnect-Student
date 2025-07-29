import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';
import Class from '../interfaces/Class';

interface ClassDialogProps {
    isOpen: boolean;
    onRequestClose: () => void;
    selectedClasses: Class[];
}

const ClassDialog: React.FC<ClassDialogProps> = ({ isOpen, onRequestClose, selectedClasses }) => {
    const classes = selectedClasses.flat();
    const [currentIndex, setCurrentIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleNextClass = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % classes.length);
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onRequestClose();
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onRequestClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onRequestClose]);

    if (!isOpen) return null;

    const currentClass = classes[currentIndex];

    const daysArray = currentClass.slot.day.split(',').map(day => day.trim());
    const dayInitials = daysArray.map(day => {
        switch (day) {
            case 'Monday': return 'Mon';
            case 'Tuesday': return 'Tue';
            case 'Wednesday': return 'Wed';
            case 'Thursday': return 'Thur';
            case 'Friday': return 'Fri';
            case 'Saturday': return 'Sat';
            case 'Sunday': return 'Sun';
            default: return day; // For any unexpected values
        }
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg p-4 w-1/3">
                <div className='flex justify-between items-center w-full mb-4'>
                    <p className='text-lg font-semibold'>Classes Scheduled</p>
                    <div className='flex items-center'>
                        <p className='text-sm font-normal'>{currentIndex + 1}/{classes.length}</p>
                        <button onClick={handleNextClass} className='text-gray-700 ml-3 py-1 px-3 rounded-full text-sm font-medium bg-gray-100 flex items-center'>
                            Next <FaChevronRight className='ml-1' />
                        </button>
                        <svg onClick={onRequestClose} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='cursor-pointer ml-3'>
                            <path d="M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                            <path d="M18 6L6 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
                <div className='w-full bg-blue-200 rounded-lg flex items-center justify-center mb-5'>
                    <Image src="/teaching.png" className="rounded-full" height={45} width={200} alt="" />
                </div>

                <div className='space-y-3 px-3'>
                    {currentClass && (
                        <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.8284 6.75736C12.3807 6.75736 12.8284 7.20507 12.8284 7.75736V12.7245L16.3553 14.0653C16.8716 14.2615 17.131 14.8391 16.9347 15.3553C16.7385 15.8716 16.1609 16.131 15.6447 15.9347L11.4731 14.349C11.085 14.2014 10.8284 13.8294 10.8284 13.4142V7.75736C10.8284 7.20507 11.2761 6.75736 11.8284 6.75736Z" fill="currentColor" stroke="currentColor" />
                                    </svg>
                                    <p className="text-gray-600 font-medium text-base ml-3">Time</p>
                                </div>
                                <p className="font-medium text-base">{currentClass.slot.slot}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M7 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M17 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17Z" fill="#1C274C" />
                                        <path d="M18 13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13Z" fill="#1C274C" />
                                        <path d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z" fill="#1C274C" />
                                        <path d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z" fill="#1C274C" />
                                        <path d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z" fill="#1C274C" />
                                        <path d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z" fill="#1C274C" />
                                    </svg>
                                    <p className="text-gray-600 font-medium text-base ml-3">Day</p>
                                </div>
                                <p className="font-medium text-base">
                                    {daysArray.length > 1 ? dayInitials.join(', ') : currentClass.slot.day}
                                </p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3432 15 9.00004 13.6569 9.00004 12C9.00004 10.3432 10.3432 9.00004 12 9.00004C13.6569 9.00004 15 10.3432 15 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7.64338 5.18899L7.56701 6.10541C7.52707 6.58478 7.50709 6.82447 7.40373 7.01167C7.31261 7.1767 7.1767 7.31261 7.01167 7.40373C6.82447 7.50709 6.58477 7.52707 6.10541 7.56701L5.18898 7.64338C4.16259 7.72892 3.6494 7.77168 3.39642 8.00615C3.17627 8.21018 3.05941 8.50232 3.07812 8.8019C3.09961 9.14615 3.44174 9.53105 4.126 10.3008L4.69153 10.9371C5.02586 11.3132 5.19302 11.5012 5.2565 11.7135C5.31243 11.9004 5.31243 12.0997 5.2565 12.2866C5.19302 12.4988 5.02586 12.6869 4.69153 13.063L4.126 13.6992C3.44174 14.469 3.09961 14.8539 3.07812 15.1982C3.05941 15.4978 3.17627 15.7899 3.39642 15.9939C3.6494 16.2284 4.16259 16.2712 5.18899 16.3567L6.10541 16.4331C6.58478 16.473 6.82446 16.493 7.01167 16.5964C7.1767 16.6875 7.31261 16.8234 7.40373 16.9884C7.50709 17.1756 7.52707 17.4153 7.56701 17.8947L7.64338 18.8111C7.72892 19.8375 7.77168 20.3507 8.00615 20.6037C8.21018 20.8238 8.50232 20.9407 8.8019 20.922C9.14615 20.9005 9.53105 20.5583 10.3008 19.8741L10.9371 19.3085C11.3132 18.9742 11.5012 18.8071 11.7135 18.7436C11.9004 18.6876 12.0997 18.6876 12.2866 18.7436C12.4988 18.8071 12.6869 18.9742 13.063 19.3085L13.6992 19.8741C14.469 20.5583 14.8539 20.9005 15.1982 20.922C15.4978 20.9407 15.7899 20.8238 15.9939 20.6037C16.2284 20.3507 16.2712 19.8375 16.3567 18.8111L16.4331 17.8947C16.473 17.4153 16.493 17.1756 16.5964 16.9884C16.6875 16.8234 16.8234 16.6875 16.9884 16.5964C17.1756 16.493 17.4153 16.473 17.8947 16.4331L18.8111 16.3567C19.8375 16.2712 20.3507 16.2284 20.6037 15.9939C20.8238 15.7899 20.9407 15.4978 20.922 15.1982C20.9005 14.8539 20.5583 14.469 19.8741 13.6992L19.3085 13.063C18.9742 12.6869 18.8071 12.4988 18.7436 12.2866C18.6876 12.0997 18.6876 11.9004 18.7436 11.7135C18.8071 11.5012 18.9742 11.3132 19.3085 10.9371L19.8741 10.3008C20.5583 9.53105 20.9005 9.14615 20.922 8.8019C20.9407 8.50232 20.8238 8.21018 20.6037 8.00615C20.3507 7.77168 19.8375 7.72892 18.8111 7.64338L17.8947 7.56701C17.4153 7.52707 17.1756 7.50709 16.9884 7.40373C16.8234 7.31261 16.6875 7.1767 16.5964 7.01167C16.493 6.82446 16.473 6.58478 16.4331 6.10541L16.3567 5.18898C16.2712 4.16259 16.2284 3.6494 15.9939 3.39642C15.7899 3.17627 15.4978 3.05941 15.1982 3.07812C14.8539 3.09961 14.469 3.44174 13.6992 4.126L13.063 4.69153C12.6869 5.02586 12.4988 5.19302 12.2866 5.2565C12.0997 5.31243 11.9004 5.31243 11.7135 5.2565C11.5012 5.19302 11.3132 5.02586 10.9371 4.69153L10.3008 4.126C9.53105 3.44174 9.14615 3.09961 8.8019 3.07812C8.50232 3.05941 8.21018 3.17627 8.00615 3.39642C7.77168 3.6494 7.72892 4.16259 7.64338 5.18899Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <p className="text-gray-600 font-medium text-base ml-3">Date</p>
                                </div>
                                <p className="font-medium text-base">
                                    {Array.isArray(currentClass.classDate)
                                        ? currentClass.classDate.length > 1
                                            ? "Recurring Class"
                                            : new Date(currentClass.classDate[0] as string).toLocaleDateString()
                                        : new Date(currentClass.classDate as string).toLocaleDateString()}
                                </p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <svg fill="gray" width="16" height="16" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path stroke="currentColor" stroke-width="2" d="M227.79492,52.61621l-96-32a11.98464,11.98464,0,0,0-7.58984,0L28.44678,52.53564l-.05078.01685-.19092.06372c-.17383.05786-.34107.12793-.51074.19312-.20118.07739-.40052.15722-.5962.24487-.24487.10962-.48706.22339-.72216.34814-.11817.06275-.23181.13233-.34766.199-.199.11426-.39526.23144-.58618.3562-.10938.07153-.21655.14551-.32361.2207q-.295.20655-.575.42993c-.09009.07154-.18091.14185-.26892.21607q-.33453.282-.64575.58691c-.04444.04346-.09192.0835-.13575.12744q-.37243.375-.70947.78077c-.06335.07592-.12109.15625-.18249.23364-.15516.1958-.30579.39453-.44837.59961-.07861.11279-.15332.22778-.228.34326q-.175.271-.33483.55127c-.07264.12671-.14551.25268-.21363.38257-.10583.20166-.20251.40844-.297.61645-.05225.115-.10987.22657-.15845.34351-.12842.30835-.24243.62353-.34522.94311-.04187.13086-.07544.2649-.113.39746-.06128.21656-.1189.43384-.16822.65455-.03125.14062-.05908.28222-.08545.4248-.04345.23462-.07861.47119-.10839.71-.01526.124-.03321.24732-.04468.37256C20.02209,63.2583,20,63.627,20,64v80a12,12,0,0,0,24,0V80.64868l23.7146,7.905a67.90093,67.90093,0,0,0,18.11377,84.73047,99.97006,99.97006,0,0,0-41.64819,36.16016,12.00007,12.00007,0,0,0,20.10351,13.10937,76.02217,76.02217,0,0,1,127.43213,0,12.00007,12.00007,0,0,0,20.10352-13.10937,99.97238,99.97238,0,0,0-41.64783-36.16016A67.9008,67.9008,0,0,0,188.2854,88.55371l39.50952-13.16992a11.99952,11.99952,0,0,0,0-22.76758ZM128,44.64941,186.05273,64l-20.70739,6.90234-.03272.011L128,83.35059,90.68677,70.91309l-.02844-.00953L69.94727,64ZM172,120A44,44,0,1,1,90.93738,96.29443l33.2677,11.08936a11.99358,11.99358,0,0,0,7.58984,0l33.2677-11.08936A43.87528,43.87528,0,0,1,172,120Z" />
                                    </svg>
                                    <p className="text-gray-600 font-medium text-base ml-3">Teacher</p>
                                </div>
                                <p className="font-medium text-base"> {currentClass ? currentClass.teacherName : ''}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassDialog;

