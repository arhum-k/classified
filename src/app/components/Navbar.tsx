"use client"
export default function Navbar() {
    
    return(
    <nav className="bg-white border-gray-200">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
        <span className="self-center text-2xl font-semibold whitespace-nowrap">RoomFinder</span>
    </a>
    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-4 py-2 text-center">
                Feature Request
            </button>
        
    </div>
    {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
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