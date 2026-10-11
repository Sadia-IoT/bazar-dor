"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "সাইন ইন করা যায়নি।");
      return;
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে!");

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#fafcfa] px-4 py-10">
      {" "}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-[#e1e8e1] bg-white p-6 shadow-sm sm:p-8"
      >
        {" "}
        <div className="text-center">
          {" "}
          <h1 className="text-2xl font-bold text-[#047f39]">
            সাইন ইন করুন{" "}
          </h1>{" "}
          <p className="mt-2 text-sm text-gray-500">
            আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন{" "}
          </p>{" "}
        </div>
        {message && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {message}
          </p>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            ইমেইল
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="name@example.com"
            className="w-full rounded-lg border border-[#e1e8e1] px-3 py-3 outline-none focus:border-[#047f39]"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            পাসওয়ার্ড
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            className="w-full rounded-lg border border-[#e1e8e1] px-3 py-3 outline-none focus:border-[#047f39]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#047f39] px-4 py-3 font-semibold text-white transition hover:bg-[#03652e] disabled:opacity-60"
        >
          {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
        </button>
        <p className="text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#047f39] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </form>
    </main>
  );
}
