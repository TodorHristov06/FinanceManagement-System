import { Header } from "@/components/header"; // Import the Header component

type Props = {
    children: React.ReactNode; // Define type for children prop (content inside the layout)
};

const DashboardLayout = ({children}: Props) => {
    return (
        <>
            <Header /> {/* Render the header at the top */}
            <main className="px-3 lg:px-14"> {/* Add padding for responsive layout */}
                {children} {/* Render the child components (e.g., page content) */}
            </main>
        </>
    );
};

export default DashboardLayout;