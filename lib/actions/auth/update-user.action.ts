"use server";

import { auth } from "@/auth";
import db from "@/database/drizzle";
import { users } from "@/database/drizzle/schema";
import { UpdateUserInfoSchema } from "@/validators/update-user-info-validator";
import { eq } from "drizzle-orm";
import * as v from "valibot";


type Res =
  | {
    success: true;
    data: {
      id: (typeof users.$inferSelect)["id"];
      firstName: (typeof users.$inferSelect)["firstName"];
    };
  }
  | { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
  | { success: false; error: string; statusCode: 401 | 500 };

export async function updateUserInfoAction(values: unknown): Promise<Res> {
  const parsedValues = v.safeParse(UpdateUserInfoSchema, values);

  if (!parsedValues.success) {
    const flatErrors = v.flatten(parsedValues.issues);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { id, firstName, lastName } = parsedValues.output;

  const session = await auth();

  if (!session?.user?.id || session.user.id !== id) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  if (session.user.firstName === firstName || session.user.lastName === lastName) {
    return { success: false, error: { root: ["No changes made"] }, statusCode: 400 };
  }

  try {
    const updatedUser = await db
      .update(users)
      .set({ firstName })
      .where(eq(users.id, id))
      .returning({ id: users.id, firstName: users.firstName })
      .then((res) => res[0]);

    return { success: true, data: updatedUser };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
