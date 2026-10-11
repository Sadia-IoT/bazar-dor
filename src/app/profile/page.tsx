
"use client";

import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fafcfa]">
        <p className="text-gray-500">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fafcfa] px-4 text-center">
        <h1 className="text-2xl font-bold text-[#047f39]">
          আগে সাইন ইন করুন
        </h1>
        <Link
          href="/sign-in"
          className="rounded-lg bg-[#047f39] px-5 py-3 font-semibold text-white"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#fafcfa] px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#e1e8e1] bg-white shadow-sm">
        <div className="bg-[#047f39] px-6 py-8 text-center text-white">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-white text-3xl font-bold text-[#047f39]">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
          <p className="mt-2 text-sm text-white/80">
            আপনার অ্যাকাউন্টের তথ্য
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-10">
          <div className="rounded-xl border border-[#e1e8e1] p-4">
            <p className="text-sm text-gray-500">আপনার নাম</p>
            <p className="mt-1 font-semibold text-gray-900">
              {session.user.name || "নাম দেওয়া হয়নি"}
            </p>
          </div>

          <div className="rounded-xl border border-[#e1e8e1] p-4">
            <p className="text-sm text-gray-500">ইমেইল ঠিকানা</p>
            <p className="mt-1 break-all font-semibold text-gray-900">
              {session.user.email}
            </p>
          </div>

          <Link
            href="/edit-profile"
            className="block rounded-lg bg-[#047f39] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#03652e]"
          >
            প্রোফাইল সম্পাদনা করুন
          </Link>

          <Link
            href="/"
            className="block text-center text-sm font-semibold text-[#047f39] hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}