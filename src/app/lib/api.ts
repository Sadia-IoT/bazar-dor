
export const BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

export const API = {
  categories: `${BASE_URL}/categories`,
  products: `${BASE_URL}/products`,

  category: (slug: string) =>
    `${BASE_URL}/categories/${slug}`,

  categoryProducts: (slug: string) =>
    `${BASE_URL}/products?category=${encodeURIComponent(slug)}`,

  product: (id: string | number) =>
    `${BASE_URL}/products/${id}`,
};