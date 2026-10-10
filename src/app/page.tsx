"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function getBanglaDate() {
  const today = new Date();

  return today.toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const [date] = useState(getBanglaDate);

  return (
    <main className="min-h-screen bg-[#fafcfa] text-gray-900">
      <header className="border-b border-[#e1e8e1] bg-[#fafcfa]">
        {" "}
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          {/* Logo, name and Bangla date */}{" "}
          <Link href="/" className="flex items-center gap-2.5 ">
            {" "}
            <span className="grid h-10 w-9 shrink-0 place-items-center rounded-lg bg-yellow-300 p-1.5">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={28}
              height={28}
              priority
              className="h-10 w-9 object-contain"
            /></span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold sm:text-xl">
                বাজার দর
              </span>

              <span className="mt-1 block text-[11px] text-gray-500 sm:text-xs">
                {date || "তারিখ লোড হচ্ছে..."}
              </span>
            </span>
          </Link>
          {/* Authentication links */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/signin"
              className="rounded-lg border border-[#e1e8e1] bg-white px-3 py-2 text-xs font-semibold transition hover:border-[#047f39] sm:px-4 sm:text-sm"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-[#047f39] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#03652e] sm:px-4 sm:text-sm"
            >
              সাইন আপ
            </Link>
          </div>
        </nav>
      </header>
    </main>
  );
}
