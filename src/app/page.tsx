export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-[#e1e8e1] bg-[#fafcfa]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <h1 className="text-2xl font-extrabold text-green-700">
            বাজার দর
          </h1>

          <a
            href="/signin"
            className="rounded-lg px-4 py-2 transition hover:bg-[#03652e]"
          >
            সাইন ইন
          </a>
          <a
            href="/signup"
            className="rounded-lg bg-[#047f39] px-4 py-2 text-white transition hover:bg-[#03652e]"
          >
            সাইন আপ
          </a>
        </div>
      </nav>
    </main>
  );
}

