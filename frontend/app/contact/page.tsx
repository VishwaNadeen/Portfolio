export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold">Contact</h1>

      <p className="opacity-80">
        Email me:{" "}
        <a className="underline" href="mailto:yourmail@gmail.com">
          yourmail@gmail.com
        </a>
      </p>

      <div className="space-y-2">
        <a className="underline" href="https://github.com/yourname" target="_blank">
          GitHub
        </a>
        <br />
        <a className="underline" href="https://linkedin.com/in/yourname" target="_blank">
          LinkedIn
        </a>
      </div>
    </div>
  );
}