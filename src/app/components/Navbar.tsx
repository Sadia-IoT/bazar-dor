"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

function getBanglaDate() {
return new Date().toLocaleDateString("bn-BD", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
});
}

export default function Navbar() {
const date = getBanglaDate();
const [menuOpen, setMenuOpen] = useState(false);
const router = useRouter();
const { data: session, isPending } = authClient.useSession();

async function handleSignOut() {
const { error } = await authClient.signOut();


if (error) {
  alert("সাইন আউট করা যায়নি। আবার চেষ্টা করো।");
  return;
}

router.push("/");
router.refresh();

}

return (
   <header className="border-b border-[#e1e8e1] bg-[#fafcfa]"> <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5"> <Link href="/" className="flex items-center gap-2.5"> <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 bg-yellow-300 p-1.5"> <Image
           src="/logo-icon.png"
           alt="বাজার দর লোগো"
           width={28}
           height={28}
           priority
           className="h-full w-full object-contain"
         /> </span>


      <span className="leading-tight">
        <span className="block text-lg font-extrabold sm:text-xl">
          বাজার দর
        </span>
        <span className="mt-1 block text-[11px] text-gray-500 sm:text-xs">
          {date}
        </span>
      </span>
    </Link>

    <div className="flex shrink-0 items-center gap-2">
  {isPending ? (
    <span className="text-sm text-gray-500">লোড হচ্ছে...</span>
  ) : session?.user ? (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded-lg border border-[#e1e8e1] bg-white px-3 py-2 text-sm font-semibold hover:border-[#047f39]"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8f5ec] text-[#047f39]">
          {session.user.name?.charAt(0).toUpperCase() || "U"}
        </span>
        <span className="max-w-28 truncate">
          {session.user.name || "ব্যবহারকারী"}
        </span>
        <span aria-hidden="true">⌄</span>
      </button>


  {menuOpen && (
    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[#e1e8e1] bg-white p-2 shadow-lg">
      <Link
        href="/profile"
        onClick={() => setMenuOpen(false)}
        className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f0f7f1]"
      >
        আমার প্রোফাইল
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >
        সাইন আউট
      </button>
    </div>
  )}
</div>


) : (
<> <Link
     href="/sign-in"
     className="rounded-lg border border-[#e1e8e1] bg-white px-3 py-2 text-xs font-semibold hover:border-[#047f39] sm:px-4 sm:text-sm"
   >
সাইন ইন </Link>


  <Link
    href="/sign-up"
    className="rounded-lg bg-[#047f39] px-3 py-2 text-xs font-semibold text-white hover:bg-[#03652e] sm:px-4 sm:text-sm"
  >
    সাইন আপ
  </Link>
</>


)}

</div>

  </nav>
</header>

);
}
