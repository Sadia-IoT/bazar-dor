"use client";

import { API} from "@/app/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toBanglaNumber, toBanglaUnit } from "@/app/lib/bangla";

type Category = {
  id: string | number;
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
  today: number;
  yesterday: number;
  change?: {
    dir: string;
    pct: number;
  };
};

function getList(data: unknown, key: string): unknown[] {
  if (Array.isArray(data)) return data;

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const result = data as Record<string, unknown>;

  if (Array.isArray(result[key])) {
    return result[key];
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (typeof result.data === "object" && result.data !== null) {
    const nestedData = result.data as Record<string, unknown>;

    if (Array.isArray(nestedData[key])) {
      return nestedData[key];
    }
  }

  return [];
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategory() {
      setLoading(true);
      setError("");

      try {
        const [categoryResponse, productResponse] = await Promise.all([
          fetch(API.categories),
          fetch(API.categoryProducts(slug)),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error("তথ্য লোড করা যায়নি");
        }

        const categoryData = await categoryResponse.json();
        const productData = await productResponse.json();

        const categoryList = getList(categoryData, "categories") as Category[];

        const productList = getList(productData, "products") as Product[];

        const foundCategory = categoryList.find((item) => item.slug === slug);

        if (!foundCategory) {
          setError("এই ক্যাটাগরি পাওয়া যায়নি।");
          return;
        }

        setCategory(foundCategory);

        // API যদি সব পণ্য ফেরত দেয়, তাহলে ক্যাটাগরি অনুযায়ী filter হবে।
        const filteredProducts = productList.filter(
          (product) => product.category === slug,
        );

        setProducts(filteredProducts);
      } catch {
        setError("তথ্য লোড করা যাচ্ছে না। আবার চেষ্টা করুন।");
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#fafcfa] px-4 py-8 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm font-semibold text-[#047f39] hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        {loading && (
          <p className="py-16 text-center text-gray-500">
            ক্যাটাগরি লোড হচ্ছে...
          </p>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && category && (
          <>
            <div className="my-8 rounded-2xl border border-[#e1e8e1] bg-white p-6 sm:p-8">
              <span className="text-4xl">{category.icon}</span>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                {category.nameBn}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                এই ক্যাটাগরির সব পণ্যের আজকের বাজার দর।
              </p>
              <p className="mt-4 font-semibold text-[#047f39]">
                মোট {toBanglaNumber(products.length)}টি পণ্য
              </p>
            </div>

            {products.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-[#e1e8e1] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <span className="text-3xl">
                      {product.categoryIcon || category.icon}
                    </span>

                    <h2 className="mt-3 text-lg font-bold">{product.nameBn}</h2>

                    <p className="mt-3 text-2xl font-extrabold text-[#047f39]">
                      ৳{toBanglaNumber(product.today)}
                      <span className="ml-1 text-sm font-medium text-gray-500">
                        / {toBanglaUnit(product.unit)}
                      </span>
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      গতকালের দাম: ৳{toBanglaNumber(product.yesterday)}
                    </p>

                    {product.change && (
                      <p
                        className={`mt-2 text-sm font-semibold ${
                          product.change.dir === "up"
                            ? "text-red-600"
                            : product.change.dir === "down"
                              ? "text-green-700"
                              : "text-gray-500"
                        }`}
                      >
                        {product.change.dir === "up"
                          ? "↑"
                          : product.change.dir === "down"
                            ? "↓"
                            : "→"}{" "}
                        {toBanglaNumber(product.change.pct)}%
                      </p>
                    )}

                    <Link
                      href={`/products/${product.id}`}
                      className="mt-4 block rounded-lg bg-[#047f39] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#03652e]"
                    >
                      বিস্তারিত দেখুন →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
