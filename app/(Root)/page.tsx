
export default function Home() {
  return <main className="mt-4">
    <div className="container">
      <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
      <div className="my-2 bg-muted" />
      <h2 className="text-3xl font-bold tracking-tight">Created with</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        <li className="w-1/4 p-2 shadow">Next.js</li>
        <li className="w-1/4 p-2 shadow">Typescript</li>
        <li className="w-1/4 p-2 shadow">Auth.js</li>
        <li className="w-1/4 p-2 shadow">Tailwind</li>
        <li className="w-1/4 p-2 shadow">Shadcn/Ui</li>
        <li className="w-1/4 p-2 shadow">Drizzle ORM</li>
        <li className="w-1/4 p-2 shadow">NeonDB</li>
        <li className="w-1/4 p-2 shadow">PostgressSQL</li>
        <li className="w-1/4 p-2 shadow">Bcrypt</li>
      </ul>
    </div>
  </main>;
}
