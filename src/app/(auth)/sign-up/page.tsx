
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("দুটি পাসওয়ার্ড মিলছে না।");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      setMessageType("error");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
      return;
    }

    toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafcfa] px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-[#e1e8e1] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#047f39]">অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="mt-2 text-sm text-gray-500">
            বাজার দর ব্যবহার করতে সাইন আপ করুন
          </p>
        </div>

        {message && (
          <div
            role="status"
            className={`rounded-lg p-3 text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            আপনার নাম
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            autoComplete="name"
            placeholder="আপনার নাম লিখুন"
            className="w-full rounded-lg border border-[#e1e8e1] px-3 py-3 outline-none focus:border-[#047f39]"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            ইমেইল
          </label>
          <input
            id="email"
            name="email"
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
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="কমপক্ষে ৮ অক্ষর"
            className="w-full rounded-lg border border-[#e1e8e1] px-3 py-3 outline-none focus:border-[#047f39]"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="আবার পাসওয়ার্ড লিখুন"
            className="w-full rounded-lg border border-[#e1e8e1] px-3 py-3 outline-none focus:border-[#047f39]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#047f39] px-4 py-3 font-semibold text-white transition hover:bg-[#03652e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
        </button>
        

<div className="mt-5 grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() =>
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })
  }
    className="flex items-center justify-center gap-2 rounded-lg border border-[#e1e8e1] bg-white px-3 py-3 text-sm font-semibold text-gray-800 transition hover:border-[#047f39] hover:bg-[#f4f8f3]"
  >
  
    Google দিয়ে চালিয়ে যান
  </button>

  <button
    type="button"
   onClick={() =>
    authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    })
  }
    className="flex items-center justify-center gap-2 rounded-lg border border-[#e1e8e1] bg-white px-3 py-3 text-sm font-semibold text-gray-800 transition hover:border-[#047f39] hover:bg-[#f4f8f3]"
  >
     
    GitHub দিয়ে চালিয়ে যান
  </button>
</div>

       
<p className="mt-5 text-center text-sm text-gray-600">
  আগে থেকেই অ্যাকাউন্ট আছে?{" "}
  <Link
    href="/sign-in"
    className="font-semibold text-[#047f39] hover:underline"
  >
    সাইন ইন করুন
  </Link>
</p>
      </form>
    </main>
  );
}