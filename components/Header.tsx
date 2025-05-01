"use client";

import { ArrowRight, Bell, Mail, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signoutAction } from "@/lib/actions/auth/signout.actions";

interface HeaderProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function Header({
  user = { name: "Austin Robertson", role: "Marketing Administrator" },
}: HeaderProps) {
  const { open, toggleSidebar } = useSidebar();
  const router = useRouter()

  const onClickHandler = async () => {
    await signoutAction();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-30 flex justify-between h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            toggleSidebar();
          }}
        // className="rounded-full bg-primary hover:bg-primary hover:text-white text-white"
        >
          <ArrowRight
            className={cn(
              "h-4 w-4 transition-all duration-700 ease-in-out",
              open ? "rotate-180" : "rotate-0",
            )}
          />
          <span className="sr-only">Go back</span>
        </Button>
        <div className="relative flex-1 max-w-md mx-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md pl-8 md:w-[300px] lg:w-[400px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-red-500">
                <span className="sr-only">Language</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 480"
                  className="h-4 w-4"
                >
                  <path fill="#012169" d="M0 0h640v480H0z" />
                  <path
                    fill="#FFF"
                    d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
                  />
                  <path
                    fill="#C8102E"
                    d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
                  />
                  <path
                    fill="#FFF"
                    d="M241 0v480h160V0H241zM0 160v160h640V160H0z"
                  />
                  <path
                    fill="#C8102E"
                    d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"
                  />
                </svg>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English (UK)</DropdownMenuItem>
            <DropdownMenuItem>English (US)</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
            <DropdownMenuItem>German</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Mail className="h-5 w-5" />
          <span className="sr-only">Messages</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-4 h-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 text-left">
                <p className="text-sm leading-none font-semibold">
                  {user.name}
                </p>
                <p className="text-xs font-normal leading-none text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              asChild
            >
              <Link href={'/profile'}>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              asChild
            >
              <Link href={'/settings'}>
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onClickHandler}
              className="cursor-pointer"
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
