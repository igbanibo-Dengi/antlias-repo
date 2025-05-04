import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { User as DefaultUser } from "next-auth";
import { users } from "@drizzle/schema";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: (typeof users.$inferSelect)["role"];
    tenantId: (typeof users.$inferSelect)["tenantId"];
    emailVerified: (typeof users.$inferSelect)["emailVerified"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultUser {
    id: (typeof users.$inferSelect)["id"];
    tenantId: (typeof users.$inferSelect)["tenantId"];
    role: (typeof users.$inferSelect)["role"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends DefaultAdapterUser {
    role: (typeof users.$inferSelect)["role"];
    tenantId: (typeof users.$inferSelect)["tenantId"];
    emailVerified: (typeof users.$inferSelect)["emailVerified"];
  }
}
export interface ExtendedAdapterUser extends CoreAdapterUser {
  role: "tenant" | "admin" | "user";
  tenantId: (typeof users.$inferSelect)["tenantId"];
}
