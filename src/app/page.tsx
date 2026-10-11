"use client";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import PriceTicker from "@/app/components/PriceTicker";
import {
  toBanglaNumber,
  toBanglaUnit,
} from "@/app/lib/bangla";

import { useEffect, useState } from "react";
import { API } from "./lib/api";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};
type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: string;
    pct: number;
  };
};



export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(""); 

  useEffect(() => {
    fetch(API.categories)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Category load failed");
        }
        return response.json();
      })
      .then((data) => {
        const categoryList = Array.isArray(data)
          ? data
          : data.categories;

        setCategories(categoryList || []);
      })
      .catch(() => {
        setError("ক্যাটাগরি লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(API.products)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product load failed");
        }
        return response.json();
      })
      .then((data) => {
        const productList = Array.isArray(data)
          ? data
          : data.products;

        setProducts(productList || []);
      })
      .catch(() => {
        setProductsError("পণ্য লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।");
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, []);

  return (
    <>
      
  <Navbar />
  <PriceTicker />
  <main className="min-h-screen bg-[#fafcfa] text-gray-900">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-12">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-[#047f39]">
            আপনার নিত্যদিনের বাজার
          </p>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            আজকের বাজার দর
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            নিত্যপ্রয়োজনীয় পণ্যের দাম জানুন সহজেই।
          </p>
        </div>

        <h2 className="mb-4 text-lg font-bold sm:text-xl">
          পণ্যের ক্যাটাগরি
        </h2>

        {loading && (
          <p className="py-8 text-center text-gray-500">
            ক্যাটাগরি লোড হচ্ছে...
          </p>
        )}

        {!loading && error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            কোনো ক্যাটাগরি পাওয়া যায়নি।
          </p>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group rounded-xl border border-[#e1e8e1] bg-white p-4 transition hover:-translate-y-1 hover:border-[#047f39] hover:shadow-md sm:p-5"
              >
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#e8f5ec] text-2xl">
                  {category.icon}
                </span>

                <h3 className="font-bold group-hover:text-[#047f39]">
                  {category.nameBn}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  পণ্য দেখুন →
                </p>
              </Link>
            ))}
          </div>
        )}
        
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">
                আজকের পণ্যের দাম
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ দাম
              </p>
            </div>
            <span className="rounded-full bg-[#e8f5ec] px-3 py-1 text-sm font-semibold text-[#047f39]">
              {toBanglaNumber( products.length)}টি পণ্য
            </span>
          </div>

          {productsLoading && (
            <p className="py-8 text-center text-gray-500">
              পণ্যের তথ্য লোড হচ্ছে...
            </p>
          )}

          {!productsLoading && productsError && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {productsError}
            </p>
          )}

          {!productsLoading && !productsError && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-2xl border border-[#e1e8e1] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#e8f5ec] text-3xl">
                      {product.image || product.categoryIcon}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.change.dir === "up"
                          ? "bg-red-50 text-red-600"
                          : product.change.dir === "down"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.change.dir === "up"
                        ? "↑"
                        : product.change.dir === "down"
                          ? "↓"
                          : "→"}{" "}
                      {toBanglaNumber( product.change.pct)}%
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-medium text-[#047f39]">
                    {product.categoryNameBn}
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    {product.nameBn}
                  </h3>

                  <p className="mt-3 text-2xl font-extrabold text-[#047f39]">
                    ৳{toBanglaNumber( product.today)}
                    <span className="ml-1 text-sm font-medium text-gray-500">
                      / {toBanglaUnit( product.unit) === "kg" ? "কেজি" :toBanglaUnit( product.unit)}
                    </span>
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#e1e8e1] pt-3 text-sm">
                    <span className="text-gray-500">গতকালের দাম</span>
                    <span className="font-semibold">৳{toBanglaNumber( product.yesterday)}</span>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="mt-4 block rounded-lg bg-[#047f39] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#03652e]"
                  >
                    বিস্তারিত দেখুন →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
    </>
  );
}