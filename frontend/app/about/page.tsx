export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="opacity-80 max-w-2xl">
        I’m a developer focused on building practical, user-friendly systems.
        I enjoy working with Next.js, Node.js, MongoDB, and modern UI design.
      </p>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Skills</h2>
        <ul className="list-disc pl-5 opacity-80">
          <li>Next.js / React / TypeScript</li>
          <li>Node.js / Express</li>
          <li>MongoDB / MySQL</li>
          <li>Tailwind CSS</li>
        </ul>
      </div>
    </div>
  );
}