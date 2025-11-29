import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const uploadRouter = {
  stationMedia: f({
    image: { maxFileSize: "8MB" },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", metadata.userId, file.url);
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
