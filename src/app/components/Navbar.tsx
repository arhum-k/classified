"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRef, useState, useEffect } from "react";
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const margin = 8;

    useEffect(() => {
        const handleResize = () => {
            if (menuRef.current) {
              const rect = menuRef.current.getBoundingClientRect();
              if (rect.right > window.innerWidth - margin) {
                menuRef.current.style.left = `-${rect.right - window.innerWidth + margin}px`;
              } else if (rect.left < margin) {
                menuRef.current.style.left = `${margin - rect.left}px`;
              } else {
                menuRef.current.style.left = '0';
              }
            }
          };
      
    
        if (isOpen) {
          handleResize();
          window.addEventListener('resize', handleResize);
        }
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [isOpen]);

    return(
    <nav className="bg-white border-gray-200 shadow-sm">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex flex-col md:flex-row items-center md:space-x-2 rtl:space-x-reverse">
                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
                <span className="self-center text-2xl md:text-3xl font-semibold whitespace-nowrap">Classified</span>
                <p className="md:pt-2 text-muted-foreground font-sans"> @ UC Berkeley</p>
            </a>
            <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
                <Link className='hidden md:flex' href="">
                    <Button variant="outline">
                        Feature Request
                    </Button>
                </Link> 
                <Link href="/display">
                    <Button variant="default_berkeley_colors">
                        Find Rooms
                    </Button>
                </Link>
        </div>
            {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-md md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                <li>
                    <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded" aria-current="page">Home</a>
                </li>
                <li>
                    <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded">About</a>
                </li>
                <li>
                    <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded">Services</a>
                </li>
                <li>
                    <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded">Contact</a>
                </li>
                </ul>
            </div> */}
        </div>
    </nav>

    )
}