"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-foreground shadow text-foreground">
      <div className="container flex items-center justify-center p-6 mx-auto  capitalize dark:text-gray-300">
        <Link
          href="/"
          className={`mx-1.5 sm:mx-6 border-b-2 hover:border-blue-500 ${pathname === "/" ? 'border-blue-500' : 'border-transparent'}`}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Home
        </Link>
        <Link
          href="/toevoegen"
          className={`mx-1.5 sm:mx-6 border-b-2 hover:border-blue-500 ${pathname === "/toevoegen" ? 'border-blue-500' : 'border-transparent'}`}
        >
          Toevoegen
        </Link>
        <Link
          href="/transacties"
          className={`mx-1.5 sm:mx-6 border-b-2 hover:border-blue-500 ${pathname === "/transacties" ? 'border-blue-500' : 'border-transparent'}`}
        >
          Transacties
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
