"use client";

import { useEffect, useState } from "react";
import { API } from "@/app/lib/api";
import {
  toBanglaNumber,
  toBanglaUnit,
} from "@/app/lib/bangla";

type Product = {
  id: number;
  nameBn: string;
  categoryIcon?: string;
  unit: string;
  today: number;
  change: {
    dir: string;
    pct: number;
  };
};

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(API.products)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product load failed");
        }
        return response.json();
      })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.data?.products)
                ? data.data.products
                : [];

        setProducts(list.slice(0, 12));
      })
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) {
    return null;
  }

  const items = [...products, ...products];

  return (
    <div className="overflow-hidden border-b border-[#e1e8e1] bg-white">
      <div className="ticker-track flex w-max items-center gap-7 py-3">
        {items.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex shrink-0 items-center gap-2 text-sm"
          >
            <span>{product.categoryIcon || "🛒"}</span>

            <span className="font-semibold text-gray-700">
              {product.nameBn}
            </span>

            <span className="font-bold text-[#047f39]">
              ৳{toBanglaNumber(product.today)}
            </span>

            <span className="text-gray-500">/{toBanglaUnit(product.unit)}</span>

            <span
              className={
                product.change?.dir === "up"
                  ? "font-semibold text-red-600"
                  : "font-semibold text-green-600"
              }
            >
              {product.change?.dir === "up" ? "▲" : "▼"}
              {toBanglaNumber(product.change?.pct ?? 0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

