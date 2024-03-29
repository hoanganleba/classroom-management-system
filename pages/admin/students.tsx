import type {NextPage} from "next";
import AdminLayout from "components/Layouts/AdminLayout";
import Link from "next/link";
import {DataStore} from "@aws-amplify/datastore";
import {Role, User, Student} from "src/models";
import {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import Image from "next/image";
import profilePic from "public/Path_2.png";
import {ChevronDoubleRightIcon, PencilAltIcon} from "@heroicons/react/solid";
import {TrashIcon} from "@heroicons/react/outline";

const Students: NextPage = () => {
    const [students, setStudents] = useState<Array<any>>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [phoneNum, setPhoneNum] = useState<string>("");

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const addStudent = async () => {
        const studentRole = await DataStore.query(Role, "3");
        const newStudent = await DataStore.save(
            new User({
                name,
                email,
                password,
                phoneNum,
                role: studentRole,
            })
        );
        await DataStore.save(
            new Student({
                user: newStudent,
            })
        );
        closeModal();
    };

    const getStudents = async () => {
        const studentModel = await DataStore.query(User);
        setStudents(studentModel.filter((data) => data.role?.name === "Student"));
    };

    const deleteStudent = async (id: any) => {
        const userModelToDelete: any = await DataStore.query(User, id);
        const studentModelToDelete: any = (await DataStore.query(Student)).filter(
            (t) => t.user?.id === id
        );
        await DataStore.delete(userModelToDelete);
        await DataStore.delete(studentModelToDelete);
    };

    useEffect(() => {
        getStudents();
        DataStore.observe(User).subscribe(() => {
            getStudents();
        });
    }, []);

    return (
        <>
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-4xl font-semibold">Student</h2>
                <div className="text-sm breadcrumbs">
                    <ul>
                        <li>
                            <Link href={"/admin"}>
                                <a>Dashboard</a>
                            </Link>
                        </li>
                        <li>Students</li>
                    </ul>
                </div>
            </div>
            <div className="rounded-2xl bg-white p-5">
                <div className="flex items-center mb-8 justify-between">
                    <div className="bg-gray-100 flex items-center py-2.5 px-4 rounded-2xl block text-gray-500">
                        <input
                            className="placeholder-gray-500 w-full font-medium focus:outline-none bg-transparent"
                            aria-label="search"
                            placeholder="Search"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="py-2 px-5 font-medium bg-blue-500 text-white rounded-full flex items-center hover:bg-blue-700 focus:ring focus:ring-blue-200"
                    >
                        <span className="mr-2">Add Student</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </button>
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog
                            as="div"
                            className="fixed inset-0 z-10 overflow-y-auto"
                            onClose={closeModal}
                        >
                            <div className="min-h-screen px-4 text-center">
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30"/>
                                {/* This element is to trick the browser into centering the modal contents. */}
                                <span
                                    className="inline-block h-screen align-middle"
                                    aria-hidden="true"
                                >
                  &#8203;
                </span>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <div
                                        className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 font-bold"
                                        >
                                            Add Student
                                        </Dialog.Title>
                                        <div className="my-6">
                                            <input
                                                onChange={(e) => setName(e.target.value)}
                                                className="focus:outline-none block w-full bg-gray-100 mb-5 font-medium py-2.5 px-4 rounded-2xl placeholder-gray-500"
                                                aria-label="name"
                                                placeholder="Full Name"
                                            />
                                            <input
                                                onChange={(e) => setPhoneNum(e.target.value)}
                                                className="focus:outline-none block w-full bg-gray-100 mb-5 font-medium py-2.5 px-4 rounded-2xl placeholder-gray-500"
                                                aria-label="phoneNum"
                                                placeholder="Phone number"
                                            />
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="focus:outline-none block w-full bg-gray-100 mb-5 font-medium py-2.5 px-4 rounded-2xl placeholder-gray-500"
                                                aria-label="email"
                                                placeholder="Email Address"
                                            />
                                            <input
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="focus:outline-none block w-full bg-gray-100 mb-5 font-medium py-2.5 px-4 rounded-2xl placeholder-gray-500"
                                                aria-label="password"
                                                placeholder="Password"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex py-2 px-5 font-medium bg-blue-500 text-white rounded-full flex items-center hover:bg-blue-700 focus:ring focus:ring-blue-200 "
                                                onClick={addStudent}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th
                            scope="col"
                            className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Phone Number
                        </th>
                        <th scope="col">
                <span
                    className="font-medium px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <Image
                                            className="rounded-full"
                                            src={profilePic}
                                            alt="Picture of the author"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {student.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {student.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {student.phoneNum}
                                </div>
                            </td>
                            <td className="px-6 py-4 flex justify-center">
                                <button
                                    className="text-white bg-blue-500 rounded-full mr-1.5 h-10 w-10 flex items-center justify-center hover:bg-blue-700 focus:ring focus:ring-blue-200">
                                    <PencilAltIcon className="h-5 w-5"/>
                                </button>
                                <button
                                    onClick={() => deleteStudent(student.id)}
                                    className="text-white bg-red-500 rounded-full ml-1.5 h-10 w-10 flex items-center justify-center hover:bg-red-700 focus:ring focus:ring-red-200"
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export async function getStaticProps() {
    return {
        props: {
            protected: true,
            userTypes: ["Admin"],
        },
    };
}

// @ts-ignore
Students.getLayout = (page: any) => <AdminLayout>{page}</AdminLayout>;

export default Students;
