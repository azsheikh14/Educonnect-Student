import React, { useState, useEffect } from "react";

const courses = [
  "Java",
  "Data Structures",
  "Intro to Physics",
  "Mathematics",
  "Business development",
];

// Attendance data including course, topic, etc.
const attendanceData = [
  {
    date: "14/05/25",
    course: "Java",
    topic: "OOP Concepts",
    status: "Present",
    instructor: "John Vick",
  },
  {
    date: "15/05/25",
    course: "Java",
    topic: "Collections",
    status: "Absent",
    instructor: "John Vick",
  },
  {
    date: "16/05/25",
    course: "Java",
    topic: "Threads",
    status: "Present",
    instructor: "John Vick",
  },
  {
    date: "17/05/25",
    course: "Java",
    topic: "Streams",
    status: "Absent",
    instructor: "John Vick",
  },
  {
    date: "18/05/25",
    course: "Java",
    topic: "JVM Basics",
    status: "Present",
    instructor: "John Vick",
  },
  {
    date: "19/05/25",
    course: "Java",
    topic: "Garbage Collection",
    status: "Absent",
    instructor: "John Vick",
  },

  {
    date: "14/05/25",
    course: "Data Structures",
    topic: "Arrays",
    status: "Present",
    instructor: "Jane Doe",
  },
  {
    date: "15/05/25",
    course: "Data Structures",
    topic: "Linked Lists",
    status: "Absent",
    instructor: "Jane Doe",
  },
  {
    date: "16/05/25",
    course: "Data Structures",
    topic: "Stacks",
    status: "Present",
    instructor: "Jane Doe",
  },
  {
    date: "17/05/25",
    course: "Data Structures",
    topic: "Queues",
    status: "Absent",
    instructor: "Jane Doe",
  },
  {
    date: "18/05/25",
    course: "Data Structures",
    topic: "Trees",
    status: "Present",
    instructor: "Jane Doe",
  },

  {
    date: "14/05/25",
    course: "Intro to Physics",
    topic: "Newton’s Laws",
    status: "Present",
    instructor: "Marie Curie",
  },
  {
    date: "15/05/25",
    course: "Intro to Physics",
    topic: "Thermodynamics",
    status: "Absent",
    instructor: "Marie Curie",
  },

  {
    date: "14/05/25",
    course: "Mathematics",
    topic: "Calculus",
    status: "Present",
    instructor: "Alan Turing",
  },
  {
    date: "15/05/25",
    course: "Mathematics",
    topic: "Linear Algebra",
    status: "Absent",
    instructor: "Alan Turing",
  },
  {
    date: "16/05/25",
    course: "Mathematics",
    topic: "Probability",
    status: "Present",
    instructor: "Alan Turing",
  },

  {
    date: "14/05/25",
    course: "Business development",
    topic: "Market Analysis",
    status: "Absent",
    instructor: "Elon Musk",
  },
  {
    date: "15/05/25",
    course: "Business development",
    topic: "Pitch Deck",
    status: "Present",
    instructor: "Elon Musk",
  },
  {
    date: "16/05/25",
    course: "Business development",
    topic: "Customer Outreach",
    status: "Present",
    instructor: "Elon Musk",
  },
];

const AttendancePage = () => {
  const [selectedCourse, setSelectedCourse] = useState("Java");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filtered = attendanceData
      .filter((a) => a.course === selectedCourse)
      .slice(0, 6); // Limit to max 6 records per course
    setFilteredData(filtered);
  }, [selectedCourse]);

  const presentCount = filteredData.filter(
    (a) => a.status === "Present"
  ).length;
  const totalCount = filteredData.length;
  const presentPercentage =
    totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <main className="p-8">
          {/* Header & Chart */}
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-700">Attendance</h1>
          </div>

          {/* Chart */}
          <div className="mt-8">
            <div className="w-[280px] bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-[#76309B]">
                Overall Attendance
              </h2>
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-[#76309B] opacity-30"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-[#76309B]"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${presentPercentage}, 100`}
                  />
                  <text
                    x="18"
                    y="19"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-[#76309B] font-semibold"
                    fontSize="10"
                  >
                    {presentPercentage}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Course Filters */}
          <div className="mt-10 flex flex-wrap gap-3">
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`px-4 py-1.5 text-sm rounded-full border font-medium transition ${
                  selectedCourse === course
                    ? "bg-[#76309B] text-white border-[#76309B]"
                    : "bg-purple-100 text-[#76309B] border-[#76309B] hover:bg-purple-200"
                }`}
              >
                {course}
              </button>
            ))}
          </div>

          {/* Attendance Table */}
          <div className="mt-6 bg-white rounded-xl shadow-md">
            <div className="bg-[#76309B] text-white rounded-t-xl px-6 py-3 font-semibold text-md">
              Attendance
            </div>
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-100 text-[#76309B] text-sm">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">
                    {selectedCourse === "Java" ? "Lecture" : "Topic"}
                  </th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Course Instructor</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredData.length > 0 ? (
                  filteredData.map((record, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4">{record.date}</td>
                      <td className="px-6 py-4">{record.topic}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{record.instructor}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-[#76309B] font-semibold"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
