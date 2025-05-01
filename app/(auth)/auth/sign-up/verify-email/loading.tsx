import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="mx-auto h-24 w-24 animate-spin text-primary" />
      </div>
    </main>
  );
}
