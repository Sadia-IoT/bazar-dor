import Link from "next/link";
import { API } from "@/app/lib/api";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { toBanglaNumber, toBanglaUnit } from "@/app/lib/bangla";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
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
  markets: Market[];
};

async function getProduct(slug: string): Promise<Product | null> {
  const response = await fetch(API.products, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  const products: Product[] = Array.isArray(result)
    ? result
    : Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.products)
        ? result.products
        : [];

  return products.find((product) => product.slug === slug) ?? null;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

// লগইন করা আছে কি না পরীক্ষা
const session = await auth.api.getSession({
  headers: await headers(),
});

// লগইন না থাকলে Sign In পেজে পাঠাবে
if (!session) {
  redirect(`/sign-in?callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
}

const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const marketMin =
    product.markets.length > 0
      ? Math.min(...product.markets.map((market) => market.min))
      : null;

  const marketMax =
    product.markets.length > 0
      ? Math.max(...product.markets.map((market) => market.max))
      : null;

  const average =
    product.markets.length > 0
      ? product.markets.reduce(
          (sum, market) => sum + (market.min + market.max) / 2,
          0
        ) / product.markets.length
      : null;

  return (
    <main className="min-h-screen bg-[#fafcfa] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-block font-semibold text-[#047f39] hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <section className="rounded-2xl border border-[#e1e8e1] bg-white p-6 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-[#f0f7f1] text-5xl">
              {product.image || product.categoryIcon || "🛒"}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {product.nameBn}
              </h1>
              <p className="mt-2 text-gray-600">
                {product.categoryNameBn} · প্রতি {toBanglaUnit(product.unit)}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-[#f0f7f1] p-5">
            <p className="text-sm text-gray-600">আজকের দাম</p>
            <p className="mt-1 text-3xl font-extrabold text-[#047f39]">
              {toBanglaNumber(product.today)} টাকা
            </p>
            <p className="mt-2 text-sm text-gray-600">
              গতকাল: {toBanglaNumber(product.yesterday)} টাকা
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "সর্বনিম্ন দাম", value: marketMin },
              { label: "সর্বোচ্চ দাম", value: marketMax },
              { label: "গড় দাম", value: average },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#e1e8e1] p-4"
              >
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="mt-2 text-xl font-bold text-gray-900">
                  {item.value !== null
                    ? `${toBanglaNumber(Math.round(item.value))} টাকা`
                    : "তথ্য নেই"}
                </p>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">
              বাজারভিত্তিক আজকের দাম
            </h2>

            {product.markets.length > 0 ? (
              <div className="mt-4 space-y-3">
                {product.markets.map((market, index) => (
                  <div
                    key={`${market.market}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#e1e8e1] p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {market.market}
                      </p>
                      <p className="text-sm text-gray-500">
                        {market.division}
                      </p>
                    </div>
                    <p className="text-right font-bold text-[#047f39]">
                      {toBanglaNumber(market.min)}–{toBanglaNumber(market.max)} টাকা
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-gray-500">
                বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
              </p>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}