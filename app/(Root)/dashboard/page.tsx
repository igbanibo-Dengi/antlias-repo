import { auth } from "@/auth";
import { USER_ROLES } from "@/lib/constants";
import { redirect } from "next/navigation";
import { findAllUsers } from "@/resources/user.queries";
import { AdminPanelComponent } from "@/components/admin-panel";

export default async function Page() {
    const session = await auth();

    if (session?.user?.role !== USER_ROLES.ADMIN) redirect("/profile");

    const users = await findAllUsers();

    return (
        <main className="mt-4">

            <AdminPanelComponent users={users} />
        </main>
    );
}

