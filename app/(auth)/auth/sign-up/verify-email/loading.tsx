import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="mx-auto h-24 w-24 animate-spin text-green-500" />

        <div className="hidden h-screen bg-muted lg:flex lg:w-1/2">
          <div className="relative h-full w-full bg-slate-950">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
