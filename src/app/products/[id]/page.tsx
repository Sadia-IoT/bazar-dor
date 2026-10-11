import Link from "next/link";
import { notFound } from "next/navigation";
import { API } from "@/app/lib/api";
import { toBanglaNumber, toBanglaUnit } from "@/app/lib/bangla";

type Product = {
id: number;
slug?: string;
nameBn?: string;
name?: string;
category?: string;
categoryNameBn?: string;
categoryIcon?: string;
emoji?: string;
unit?: string;
price?: number;
currentPrice?: number;
minPrice?: number;
maxPrice?: number;
averagePrice?: number;
description?: string;
marketPrices?: {
name?: string;
marketName?: string;
price?: number;
}[];
};

async function getProduct(id: string): Promise<Product | null> {
const response = await fetch(API.product(id), {
cache: "no-store",
});

if (!response.ok) {
return null;
}

const result = await response.json();
const product = result.data ?? result.product ?? result;

if (!product || typeof product !== "object" || Array.isArray(product)) {
return null;
}

return product as Product;
}

export default async function ProductDetailsPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;
const product = await getProduct(id);

if (!product) {
notFound();
}

const name = product.nameBn || product.name || "পণ্যের নাম";
const price = product.currentPrice ?? product.price ?? 0;
const unit = product.unit || "kg";
const markets = product.marketPrices || [];

return ( <main className="min-h-screen bg-[#fafcfa] px-4 py-10"> <div className="mx-auto max-w-5xl"> <Link
       href="/"
       className="mb-6 inline-block text-sm font-semibold text-[#047f39] hover:underline"
     >
← হোম পেজে ফিরে যান </Link>

    <section className="rounded-2xl border border-[#e1e8e1] bg-white p-6 sm:p-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-[#f0f7f1] text-5xl">
          {product.emoji || product.categoryIcon || "🛒"}
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {name}
          </h1>

          <p className="mt-2 text-gray-600">
            {product.description || "এই পণ্যের বর্তমান বাজারদর দেখুন।"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {product.categoryNameBn && (
              <span className="rounded-full bg-[#e8f5ec] px-3 py-1 text-sm text-[#047f39]">
                {product.categoryNameBn}
              </span>
            )}

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              প্রতি {toBanglaUnit(unit)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-[#f5f9f5] p-5">
        <p className="text-sm text-gray-500">আজকের দাম</p>
        <p className="mt-1 text-3xl font-extrabold text-[#047f39]">
          {toBanglaNumber(price)} টাকা
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "সর্বনিম্ন দাম", value: product.minPrice },
          { label: "সর্বোচ্চ দাম", value: product.maxPrice },
          { label: "গড় দাম", value: product.averagePrice },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[#e1e8e1] p-4"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-xl font-bold text-gray-900">
              {item.value != null
                ? `${toBanglaNumber(item.value)} টাকা`
                : "তথ্য নেই"}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length > 0 ? (
          <div className="mt-4 space-y-3">
            {markets.map((market, index) => (
              <div
                key={`${market.name || market.marketName || "market"}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#e1e8e1] p-4"
              >
                <span className="font-medium text-gray-700">
                  {market.name || market.marketName || "স্থানীয় বাজার"}
                </span>
                <span className="font-bold text-[#047f39]">
                  {market.price != null
                    ? `${toBanglaNumber(market.price)} টাকা`
                    : "তথ্য নেই"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-[#e1e8e1] p-5 text-sm text-gray-500">
            এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    </section>
  </div>
</main>


);
}
