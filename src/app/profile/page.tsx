"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export default function ProfilePage() {
const { data: session, isPending, refetch } = authClient.useSession();

const [name, setName] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [success, setSuccess] = useState(false);

useEffect(() => {
if (session?.user) {
setName(session.user.name || "");
}
}, [session?.user]);

async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
setMessage("");
setSuccess(false);


const trimmedName = name.trim();

if (trimmedName.length < 3) {
  setMessage("নাম কমপক্ষে ৩ অক্ষরের হতে হবে।");
  return;
}

setLoading(true);

const { error } = await authClient.updateUser({
  name: trimmedName,
});

setLoading(false);

if (error) {
  toast.error(error.message || "নাম আপডেট করা যায়নি।");
  return;
}

await refetch();
setName(trimmedName);

toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");

}

if (isPending) {
return ( <main className="flex min-h-[60vh] items-center justify-center bg-[#fafcfa]"> <p className="text-gray-500">প্রোফাইল লোড হচ্ছে...</p> </main>
);
}

if (!session?.user) {
return ( <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fafcfa] px-4 text-center"> <h1 className="text-2xl font-bold text-[#047f39]">
আগে সাইন ইন করুন </h1> <Link
       href="/sign-in"
       className="rounded-lg bg-[#047f39] px-5 py-3 font-semibold text-white"
     >
সাইন ইন </Link> </main>
);
}

return ( <main className="min-h-[70vh] bg-[#fafcfa] px-4 py-10 sm:py-16"> <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#e1e8e1] bg-white shadow-sm"> <div className="bg-[#047f39] px-6 py-8 text-center text-white"> <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-white text-3xl font-bold text-[#047f39]">
{session.user.name?.charAt(0).toUpperCase() || "U"} </div>


      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="mt-2 text-sm text-white/80">
        আপনার অ্যাকাউন্টের তথ্য পরিচালনা করুন
      </p>
    </div>

    <div className="space-y-6 p-6 sm:p-10">
      <div className="rounded-xl border border-[#e1e8e1] p-4">
        <p className="text-sm text-gray-500">ইমেইল ঠিকানা</p>
        <p className="mt-1 break-all font-semibold text-gray-900">
          {session.user.email}
        </p>
     </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            আপনার নাম
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            maxLength={100}
            autoComplete="name"
            className="w-full rounded-lg border border-[#e1e8e1] px-4 py-3 outline-none focus:border-[#047f39]"
            placeholder="আপনার নাম লিখুন"
          />
        </div>

        {message && (
          <p
            role="status"
            className={`rounded-lg p-3 text-sm ${
              success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || name.trim() === session.user.name}
          className="w-full rounded-lg bg-[#047f39] px-5 py-3 font-semibold text-white transition hover:bg-[#03652e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "আপডেট হচ্ছে..." : "নাম আপডেট করুন"}
        </button>
      </form>

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
