"use client";
import ProductsManager from "@/app/components/products/productsManager";
import { ComponentType } from "@/lib/types/database/components";

export default function Products() {
  return <ProductsManager componentType={ComponentType.CPU} />;
}
