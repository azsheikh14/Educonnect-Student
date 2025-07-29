// import React, { useEffect, useState } from 'react';
// import Select, { StylesConfig, SingleValue, MultiValue } from 'react-select';
// import Class from '../interfaces/Class';
// import { useUserContext } from '../contexts/userContext';
// import { smartScheduleClasses } from '@/app/services/classService'
// import { toast } from 'react-toastify';

// type Student = {
//     _id: string;
//     name: string;
// };

// interface SmartScheduleModalProps {
//     students?: Student[];
// }

// interface Option {
//     value: string;
//     label: string;
// }

// const SmartScheduleModal: React.FC<SmartScheduleModalProps> = ({ students }) => {
//     if (!students) return;
//     const { userData } = useUserContext()
//     const [student, setStudent] = useState<Student | null>(null);
//     const [startDate, setStartDate] = useState<string>('');
//     const [endDate, setEndDate] = useState<string>('');
//     const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
//     const [classType, setClassType] = useState<string | null>(null);
//     const [subject, setSubject] = useState<string[]>([]);
//     const [classLocation, setClassLocation] = useState<string>('');
//     const [setReminder, setSetReminder] = useState<boolean>(false);
//     const [smartScheduleDialog, setSmartScheduleDialog] = useState<boolean>(true);
//     const [startHour, setStartHour] = useState<string>('');
//     const [startMinute, setStartMinute] = useState<string>('');
//     const [endHour, setEndHour] = useState<string>('');
//     const [endMinute, setEndMinute] = useState<string>('');
//     const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
//     const [startAmPm, setStartAmPm] = useState<string>('AM');
//     const [endAmPm, setEndAmPm] = useState<string>('AM');

//     const handleStartHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
//             setStartHour(value);
//         }
//     };

//     const handleStartMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
//             setStartMinute(value);
//         }
//     };

//     const handleEndHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
//             setEndHour(value);
//         }
//     };

//     const handleEndMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
//             setEndMinute(value);
//         }
//     };

//     const classTypes = [
//         { value: 'Demo', label: 'Demo' },
//         { value: 'Regular', label: 'Regular' }
//     ];

//     const handleDayChange = (day: string) => {
//         setDaysOfWeek(prev =>
//             prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
//         );
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (student?._id && classType) {
//             const classEntries: Class[] = [];
//             const iteration: string[] = [];
//             const formatTime = (hour: number, minute: number, amPm: string) => {
//                 return `${hour}:${minute.toString().padStart(2, '0')} ${amPm}`;
//             };
//             const startHourNum = parseInt(startHour, 10);
//             const endHourNum = parseInt(endHour, 10);
//             const startMinuteNum = isNaN(parseInt(startMinute, 10)) ? 0 : parseInt(startMinute, 10);
//             const endMinuteNum = isNaN(parseInt(endMinute, 10)) ? 0 : parseInt(endMinute, 10);
//             const startTime = formatTime(startHourNum % 12 || 12, startMinuteNum, startAmPm);
//             const endTime = formatTime(endHourNum % 12 || 12, endMinuteNum, endAmPm);

//             const createClassEntry = (days: string[], dates: string[] = [], scheduleType: 'unlimited' | 'limited' = 'limited') => ({
//                 _id: '',
//                 isNew: true,
//                 studentProfilePic: '',
//                 studentId: student?._id,
//                 teacherId: userData?._id || '',
//                 teacherName: userData?.name || '',
//                 studentName: student?.name,
//                 slot: { day: days.join(', '), slot: `${startTime} - ${endTime}` },
//                 classDate: dates,
//                 status: 'Scheduled',
//                 notes: '',
//                 type: classType,
//                 subjects: subject,
//                 classes: [],
//                 isConfirmed: false,
//                 jitsiLink: '',
//                 isConfirmedByStudent: false,
//                 isConfirmedByTeacher: true,
//                 scheduleType // 'unlimited' or 'limited'
//             });

//             if (isUnlimited) {
//                 const days: string[] = daysOfWeek;
//                 const unlimitedClassEntry = createClassEntry(days, [], 'unlimited');
//                 classEntries.push(unlimitedClassEntry);
//             } else {
//                 const currentDate = new Date(startDate);
//                 const endDateObj = new Date(endDate);
//                 const dates: string[] = [];
//                 while (currentDate <= endDateObj) {
//                     const day = currentDate.toLocaleString('en-US', { weekday: 'long' });
//                     if (daysOfWeek.includes(day)) {
//                         dates.push(currentDate.toISOString());
//                     }
//                     currentDate.setDate(currentDate.getDate() + 1);
//                 }
//                 const classEntry = createClassEntry(daysOfWeek, dates, 'limited');
//                 classEntries.push(classEntry);
//             }
//                 const currentDate = new Date(startDate);
//                 const endDateObj = new Date(endDate);
//                 const dates: string[] = [];
//                 while (currentDate <= endDateObj) {
//                     const day = currentDate.toLocaleString('en-US', { weekday: 'long' });
//                     if (daysOfWeek.includes(day)) {
//                         dates.push(currentDate.toISOString());
//                     }
//                     currentDate.setDate(currentDate.getDate() + 1);
//                 }
//                 const classEntry = createClassEntry(daysOfWeek, dates, 'limited');
//                 classEntries.push(classEntry);
//             }

//             setStudent(null);
//             setClassType(null);
//             setSubject([]);
//             setStartHour('');
//             setEndHour('');
//             setStartMinute('');
//             setEndMinute('');
//             setStartAmPm('AM');
//             setEndAmPm('AM');
//             setIsUnlimited(false);
//             setStartDate('');
//             setEndDate('');
//             setDaysOfWeek([]);
//             setClassLocation('');
//             setSetReminder(false);

//         } else {
//             toast.warning("Please fill in all required fields");
//         }
//     };

//     const customStyles: StylesConfig<Option> = {
//         control: (base) => ({
//             ...base,
//             padding: '0',
//             height: '56px',
//             backgroundColor: '#F9FAFB',
//             border: '1px solid #E5E7EB',
//             borderRadius: '0.75rem',
//             boxShadow: 'none',
//             cursor: 'pointer',
//             '&:hover': {
//                 borderColor: '#E5E7EB',
//             },
//         }),
//         valueContainer: (provided) => ({
//             ...provided,
//             padding: '0 1rem',
//         }),
//         input: (provided) => ({
//             ...provided,
//             margin: '0',
//         }),
//         placeholder: (provided) => ({
//             ...provided,
//             margin: '0',
//         }),
//         dropdownIndicator: (provided) => ({
//             ...provided,
//             padding: '15px',
//         }),
//         indicatorsContainer: (provided) => ({
//             ...provided,
//             padding: '0',
//         }),
//         menu: (provided) => ({
//             ...provided,
//             zIndex: 100,
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             cursor: 'pointer',
//             backgroundColor: state.isFocused ? '#E5E7EB' : provided.backgroundColor,
//             color: state.isFocused ? '#000' : provided.color,
//         }),
//     };

//     if (!smartScheduleDialog) return null;

//     const options = [
//         { value: 'AM', label: 'AM' },
//         { value: 'PM', label: 'PM' },
//     ];

//     const changeSelectedStudent = (newValue: SingleValue<Option> | MultiValue<Option>) => {
//         console.log('newValue :', newValue);
//         if (newValue && !Array.isArray(newValue)) {
//             const selectedStudent: Student = {
//                 _id: (newValue as Option).value,
//                 name: (newValue as Option).label,
//             };
//             setStudent(selectedStudent);
//         } else {
//             setStudent(null);
//         }
//     };

//     return (
//         <div className='p-4 bg-white rounded-xl h-[80vh] overflow-auto scrollbar-thin scrollbar-track-rounded scrollbar-thumb-rounded'>
//             <form onSubmit={handleSubmit} className='space-y-6'>
//                 <div className=''>
//                     <label className='block mb-3'>Select Student</label>
//                     <Select
//                         name="student"
//                         onChange={changeSelectedStudent}
//                         options={students.map(student => ({ value: student._id, label: student.name }))}
//                         classNamePrefix="select"
//                         isClearable
//                         styles={customStyles}
//                         className="w-full basic-multi-select"
//                         placeholder="Select a student"
//                     />
//                 </div>

//                 <div className='flex justify-between space-x-4 h-24'>
//                     <div>
//                         <label className='block mb-3'>Recurring Classes</label>
//                         <div className='flex items-center'>
//                             <input
//                                 type='checkbox'
//                                 className='peer h-5 w-5 cursor-pointer transition-all hover:shadow-md border mr-3 accent-blue-500'
//                                 checked={isUnlimited}
//                                 onChange={() => setIsUnlimited(!isUnlimited)}
//                             />
//                             <span className='text-gray-700'>Enable for classes that repeat indefinitely without specific date constraints.</span>
//                         </div>
//                     </div>
//                     {!isUnlimited && (
//                         <div className='flex justify-between space-x-4'>
//                             <div className='w-1/2'>
//                                 <label className='block mb-3'>Start Date</label>
//                                 <input
//                                     type='date'
//                                     className='w-full p-2 border rounded'
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                 />
//                             </div>
//                             <div className='w-1/2'>
//                                 <label className='block mb-3'>End Date</label>
//                                 <input
//                                     type='date'
//                                     className='w-full p-2 border rounded'
//                                     value={endDate}
//                                     onChange={(e) => setEndDate(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className=''>
//                     <label className='block mb-3'>Days of the Week</label>
//                     <div className='flex flex-wrap gap-2'>
//                         {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
//                             <div
//                                 key={day}
//                                 onClick={() => handleDayChange(day)}
//                                 className={`cursor-pointer px-4 py-2 rounded ${daysOfWeek.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
//                                     }`}
//                             >
//                                 {day}
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className='flex w-full space-x-5'>
//                     <div className='w-1/2'>
//                         <label className='block mb-3'>Start Time</label>
//                         <div className='flex space-x-2 items-center'>
//                             <input type="number" min='1' placeholder='HH' max='12' value={startHour} onChange={handleStartHourChange} className="w-1/3 px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
//                             <span>:</span>
//                             <input type="number" min='1' placeholder='MM' max='59' value={startMinute} onChange={handleStartMinuteChange} className="w-1/3 px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
//                             <Select
//                                 className='w-1/3'
//                                 options={options}
//                                 onChange={(option) => setStartAmPm((option as SingleValue<{ value: string; label: string }>)?.value || 'AM')}
//                                 defaultValue={options[0]}
//                                 styles={customStyles}
//                             />
//                         </div>
//                     </div>

//                     <div className='w-1/2'>
//                         <label className='block mb-3'>End Time</label>
//                         <div className='flex space-x-2 items-center'>
//                             <input type="number" min='1' placeholder='HH' max='12' value={startHour} onChange={handleEndHourChange} className="w-1/3 px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
//                             <span>:</span>
//                             <input type="number" min='1' placeholder='MM' max='59' value={startMinute} onChange={handleEndMinuteChange} className="w-1/3 px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
//                             <Select
//                                 className='w-1/3'
//                                 options={options}
//                                 onChange={(option) => setEndAmPm((option as SingleValue<{ value: string; label: string }>)?.value || 'AM')}
//                                 defaultValue={options[0]}
//                                 styles={customStyles}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className=''>
//                     <label className='block mb-3'>Class Type</label>
//                     <Select
//                         name="classType"
//                         onChange={(option) => setClassType((option as SingleValue<{ value: string; label: string }>)?.value || null)}
//                         options={classTypes}
//                         classNamePrefix="select"
//                         isClearable
//                         className="w-full basic-multi-select"
//                         styles={customStyles}
//                         placeholder="Select a class type"
//                     />
//                 </div>

//                 <div className=''>
//                     <label className='block mb-3'>Subject</label>
//                     <Select
//                         name="subject"
//                         onChange={(option) => {
//                             if (option && 'value' in option) {
//                                 setSubject([option.value]);
//                             } else if (Array.isArray(option)) {
//                                 setSubject(option.map(o => o.value));
//                             } else {
//                                 setSubject([]);
//                             }
//                         }}
//                         options={userData?.courses?.map((subject:any) => ({ value: subject, label: subject })) || []}
//                         classNamePrefix="select"
//                         isClearable
//                         className="w-full basic-multi-select"
//                         styles={customStyles}
//                         placeholder="Select a class type"
//                     />
//                 </div>

//                 <div className=''>
//                     <label className='block mb-3'>Location</label>
//                     <input type="text" placeholder='Location' value={classLocation} onChange={(e) => setClassLocation(e.target.value)} className="w-full px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
//                 </div>

//                 <div className='flex items-center'>
//                     <input
//                         type='checkbox'
//                         className='h-5 w-5 cursor-pointer transition-all hover:shadow-md border mr-3 accent-blue-500'
//                         checked={setReminder}
//                         onChange={() => setSetReminder(!setReminder)}
//                     />
//                     <span className='text-gray-700'>Set Reminder</span>
//                 </div>

//                 <button type="submit" className='block w-full py-3 mt-6 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition'>
//                     Schedule Class
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default SmartScheduleModal;

