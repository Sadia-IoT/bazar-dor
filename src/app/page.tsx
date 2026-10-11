"use client";

import Image from "next/image";
import Link from "next/link";
import { toBanglaNumber, toBanglaUnit } from "@/app/lib/bangla";

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


function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const badgeColor = isUp
    ? "bg-red-50 text-red-700"
    : isDown
      ? "bg-green-50 text-green-700"
      : "bg-gray-100 text-gray-500";

  const arrow = isUp ? "▲" : isDown ? "▼" : "—";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-[#e1e8e1] bg-white p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5"
    >
      <div className="mb-4 flex h-24 items-center justify-center rounded-xl bg-[#f4f8f3]">
        <span className="text-5xl transition group-hover:scale-110">
          {product.image || product.categoryIcon || "🛒"}
        </span>
      </div>

      <h3 className="truncate font-bold text-gray-900 group-hover:text-[#047f39]">
        {product.nameBn}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        প্রতি {toBanglaUnit(product.unit)}
      </p>

      <div className="my-4 border-t border-dashed border-[#e1e8e1]" />

      <p className="text-xs text-gray-500">আজকের দাম</p>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xl font-extrabold text-[#047f39]">
          {toBanglaNumber(product.today)}{" "}
          <span className="text-sm font-semibold">টাকা</span>
        </p>

        <span className={`rounded-lg px-2 py-1.5 text-xs font-bold ${badgeColor}`}>
          {arrow} {toBanglaNumber(Math.abs(product.change.pct).toFixed(1))}%
        </span>
      </div>
    </Link>
  );
}

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
        const categoryList = Array.isArray(data) ? data : data.categories;

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
        const productList = Array.isArray(data) ? data : data.products;
         console.log("Fetched products:", productList); // Debugging line
        setProducts(productList || []);
      })
      .catch(() => {
        setProductsError("পণ্য লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।");
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, []);
  const today = new Date();

  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  
  // আজ দাম বেড়েছে — Top 6
  const risingProducts = [...products]
    .filter((product) => product.change.dir === "up")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  // আজ দাম কমেছে — Top 6
  const fallingProducts = [...products]
    .filter((product) => product.change.dir === "down")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#e1e8e1] text-gray-900">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 rounded-2xl border border-[#e1e8e1] bg-white px-5 py-10 sm:mt-10 sm:px-8 sm:py-10 md:grid-cols-2">
        {" "}
        <div>
          {" "}
          <p className="mb-3 text-sm font-semibold text-[#047f39]">
            {" "}
            {banglaDate}{" "}
          </p>{" "}
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {" "}
            আজকের বাজারের দাম এক নজরে{" "}
          </h1>{" "}
          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            {" "}
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক
            জায়গায়।{" "}
          </p>{" "}
          <Link
            href="#সব-পণ্য"
            className="mt-7 inline-flex rounded-lg bg-[#047f39] px-6 py-3 font-semibold text-white transition hover:bg-[#03652e]"
          >
            {" "}
            সব পণ্য দেখুন →{" "}
          </Link>{" "}
        </div>{" "}
        <div className="relative mx-auto w-full max-w-sm">
          {" "}
          <Image
            src="/bazar-hero.png"
            alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
            width={450}
            height={350}
            priority
            className="h-auto w-full object-contain"
          />{" "}
        </div>{" "}
      </section>
      
     
<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  {productsLoading ? (
    <p className="py-10 text-center text-gray-500">
      পণ্য লোড হচ্ছে...
    </p>
  ) : productsError ? (
    <p className="py-10 text-center text-red-600">
      {productsError}
    </p>
  ) : products.length === 0 ? (
    <p className="py-10 text-center text-gray-500">
      কোনো পণ্য পাওয়া যায়নি।
    </p>
  ) : (
    <>
      {/* Section A */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900">
          <span className="text-red-600">▲</span> আজ দাম বেড়েছে
        </h2>
        <p className="mb-6 mt-2 text-sm text-gray-500">
          যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {risingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Section B */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900">
          <span className="text-green-600">▼</span> আজ দাম কমেছে
        </h2>
        <p className="mb-6 mt-2 text-sm text-gray-500">
          যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fallingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Section C */}
      <div id="সব-পণ্য" className="scroll-mt-24">
        <h2 className="text-2xl font-extrabold text-gray-900">
          সব পণ্য
        </h2>
        <p className="mb-6 mt-2 text-sm text-gray-500">
          নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এক নজরে দেখুন।
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  )}
</section>
    </main>
  );
}
