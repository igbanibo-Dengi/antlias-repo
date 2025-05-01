import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { auth } from "@/auth";
import { after } from "next/server";
import db from "@/database/drizzle";
import { users } from "@/database/drizzle/schema";
import { eq } from "drizzle-orm";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Image from "next/image";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  after(async () => {
    if (!session?.user?.id) return;

    //check if last activity date is today
    const lastActivityDate = await db
      .select({ lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.id, session.user.id))
      .then((res) => res[0]?.lastActivityDate);
    if (lastActivityDate === new Date().toISOString().slice(0, 10)) return;

    //update last activity date
    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session.user.id));
  });

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <main className="flex min-h-screen flex-col">
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />
        <SidebarInset className="flex min-h-screen flex-col">
          <Header
            user={{ name: "Austin Robertson", role: "Marketing Administrator" }}
          />
          <main className="flex-1 flex flex-col bg-muted">
            <div className="h-[90px] w-full rounded-b-2xl overflow-hidden">
              <Image
                src="/icons/Graphic-Side.svg"
                alt="Ant-lias Logo"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-b-2xl"
                priority
              />
            </div>
            <div className="px-4 pt-4 md:px-6 md:pt-6 -translate-y-[40px] flex-1">
              {children}
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
