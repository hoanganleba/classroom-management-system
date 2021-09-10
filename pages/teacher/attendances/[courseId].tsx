import TeacherLayout from "../../../components/Layouts/TeacherLayout";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {Fragment, useEffect, useState} from "react";
import {DataStore} from "@aws-amplify/datastore";
import {Course, Enrolment, Student} from "../../../src/models";
import Link from "next/link";
import {Dialog, Transition} from "@headlessui/react";

const Attendances: NextPage = () => {
    const router = useRouter()
    const {courseId} = router.query
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [students, setStudents] = useState<Array<any>>([])
    const [studentIdSelected, setStudentIdSelected] = useState('')
    const [enrollments, setEnrollments] = useState<Array<any>>([])

    const addStudentToCourse = async () => {
        const courseModel = await DataStore.query(Course)
        const course = courseModel.filter(item => item.id === courseId)
        await DataStore.save(
            new Enrolment({
                course: course[0],
                studentID: studentIdSelected
            })
        )
        closeModal()
    }

    const getEnrollments = async () => {
        const enrollmentModel = await DataStore.query(Enrolment)
        const studentModel = await DataStore.query(Student)
        setEnrollments(enrollmentModel)
        setStudents(studentModel)
    }


    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    useEffect(() => {
        getEnrollments()
        DataStore.observe(Enrolment).subscribe(() => {
            getEnrollments()
        })
    }, [])

    return (
        <div className="mx-2 mb-8">
            <div className="mt-11 mx-4 flex justify-between items-end mb-6">
                <h2 className="text-4xl text-gray-800 font-semibold">Attendance</h2>
                <div className="text-sm flex items-center font-medium">
                    <Link href={"/teacher"}>
                        <a className="text-gray-600">Dashboard</a>
                    </Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mx-2" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                    </svg>
                    <Link href={"/teacher/courses"}>
                        <a className="text-gray-600">Courses</a>
                    </Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mx-2" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                    </svg>
                    <p className="text-blue-500">Attendance</p>
                </div>
            </div>
            <div className="rounded-2xl bg-white p-5">
                <div className="flex items-center mb-8 justify-between">
                    <div className="bg-gray-100 flex items-center py-2.5 px-4 rounded-2xl block text-gray-500">
                        <input
                            className="placeholder-gray-500 w-full font-medium focus:outline-none bg-transparent"
                            aria-label="search" placeholder="Search"/>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto" fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th scope="col"
                            className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student Name
                        </th>
                        <th scope="col">
                            <span
                                className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Present
                            </span>
                        </th>
                        <th scope="col">
                            <span
                                className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tardy
                            </span>
                        </th>
                        <th scope="col">
                            <span
                                className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                On Leave
                            </span>
                        </th>
                        <th scope="col">
                            <span
                                className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Absent
                            </span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {enrollments.map(attendance => (
                            <tr key={attendance.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {students.filter(student => student.id === attendance.studentID).map(x => x.user?.name)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center">
                                    <input type="checkbox"/>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center">
                                    <input type="checkbox"/>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center">
                                    <input type="checkbox"/>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center">
                                    <input type="checkbox"/>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// @ts-ignore
Attendances.getLayout = (page: any) => (
    <TeacherLayout>
        {page}
    </TeacherLayout>
)

export default Attendances
