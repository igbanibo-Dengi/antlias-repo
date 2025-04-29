import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { NavlLinks } from "./NavlLinks";

export const Header = () => {
  return (
    <nav className="h-14 border-b-2 py-6">
      <div className="h-full container flex justify-between items-center">
        <h3 className="text-3xl tracking-tight font-bold">
          <Link href="/">Next.Js</Link>
        </h3>
        <NavlLinks />
      </div>
    </nav>
  );
};
