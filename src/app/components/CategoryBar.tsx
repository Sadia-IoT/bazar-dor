
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { API } from "@/app/lib/api";

type Category = {
  id: string | number;
  slug: string;
  nameBn: string;
  icon: string;
};

export default function CategoryBar() {
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API.categories)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Category load failed");
        }

        return response.json();
      })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.categories)
            ? data.categories
            : Array.isArray(data.data)
              ? data.data
              : [];

        setCategories(list);
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="border-t border-[#e1e8e1] bg-[#fafcfa]">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-5">
        <Link
          href="/"
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            pathname === "/"
              ? "bg-[#047f39] text-white"
              : "text-gray-600 hover:bg-[#e8f5ec] hover:text-[#047f39]"
          }`}
        >
          সব পণ্য
        </Link>

        {!loading &&
          categories.map((category) => {
            const active =
              pathname === `/categories/${category.slug}`;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[#047f39] text-white"
                    : "text-gray-600 hover:bg-[#e8f5ec] hover:text-[#047f39]"
                }`}
              >
                {category.icon} {category.nameBn}
              </Link>
            );
          })}

        {loading && (
          <span className="text-sm text-gray-500">
            ক্যাটাগরি লোড হচ্ছে...
          </span>
        )}

        {!loading && categories.length === 0 && (
          <span className="text-sm text-gray-500">
            ক্যাটাগরি লোড করা যায়নি।
          </span>
        )}
      </div>
    </div>
  );
}