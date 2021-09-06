import StudentSidebar from "../Sidebar/StudentSidebar";
import Container from "../Container";

const StudentLayout = ({children}: any) => {
    return (
        <>
            <div className="h-screen flex">
                <StudentSidebar/>
                <Container>
                    {children}
                </Container>
            </div>
        </>
    )
}
export default StudentLayout
