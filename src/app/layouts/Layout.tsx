import React, { ReactNode } from "react";   
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LayoutProps {
    children: ReactNode;
}


const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#fbfbfb] text-black overflow-y-auto">
            <Navbar />
            <div className="flex flex-col overflow-y-auto">
                {children}
            </div>
            <footer className="py-4 bg-white mt-auto shadow-sm flex flex-col items-center justify-center">
                <div className="text-muted-foreground text-sm text-center">
                    <p>ak</p>
                </div>
                <Link className="md:hidden mt-2" href="">
                    <Button variant="outline">
                        Feature Request
                    </Button>
                </Link>
            </footer>
        </div>

    );
};

export default Layout;