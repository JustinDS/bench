"use client";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Group, StepBack, X } from "lucide-react";
import { FragmentProps, useState } from "react";
import ComponentManager from "../components/component/componentManager";
import ManufacturerManager from "../components/manufacturers/manufacturerManager";
import VendorsManager from "../components/vendors/vendorsManager";
import ModelManager from "../components/models/modelManager";
import PartnerSeriesManager from "../components/partnerSeries/partnerSeriesManager";
import CpuManager from "../components/cpu/cpuManager";
import GpuManager from "../components/gpu/gpuManager";
import SeriesManager from "../components/series/seriesManager";
import ProductsManager, {
  ProductsManagerProps,
} from "../components/products/productsManager";

const None: React.FC = () => null;

type FocusComponentsMap = {
  components: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  manufacturers: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  vendors: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  series: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  models: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  partnerSeries: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  cpuProducts: {
    component: typeof ProductsManager;
    props: ProductsManagerProps;
  };
  gpuProducts: {
    component: typeof ProductsManager;
    props: ProductsManagerProps;
  };
  cpus: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  gpus: {
    component: typeof ComponentManager;
    props: Record<string, never>; // no props
  };
  none: {
    component: React.FC;
    props: Record<string, never>; // no props
  };
};

const focusComponents: FocusComponentsMap = {
  components: { component: ComponentManager, props: {} },
  manufacturers: { component: ManufacturerManager, props: {} },
  vendors: { component: VendorsManager, props: {} },
  series: { component: SeriesManager, props: {} },
  models: { component: ModelManager, props: {} },
  partnerSeries: { component: PartnerSeriesManager, props: {} },
  cpuProducts: { component: ProductsManager, props: { componentId: 1 } },
  gpuProducts: { component: ProductsManager, props: { componentId: 6 } },
  cpus: { component: CpuManager, props: {} },
  gpus: { component: GpuManager, props: {} },
  none: { component: None, props: {} },
};

export default function AdminClient() {
  const [activeFocus, setActiveFocus] =
    useState<keyof typeof focusComponents>("none");

  const { component: ActiveComponent, props } = focusComponents[activeFocus];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("components")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Components</CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}

        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("manufacturers")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Manufacturers
              </CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}

        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("vendors")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Vendors</CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}

        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("series")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Series</CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}
        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("models")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Models</CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}
        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("partnerSeries")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Partner Series
              </CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}
        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("cpuProducts")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                CPU Products
              </CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}
        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("gpuProducts")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                GPU Products
              </CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}
        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("cpus")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">{"CPU's"}</CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}
        {activeFocus === "none" && (
          <Card
            onClick={() => setActiveFocus("gpus")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group mb-6 flex flex-col gap-4 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">{"GPU's"}</CardTitle>
              <Group className="stroke-blue-300" />
            </CardHeader>
            {/* <CardContent>Manage Your Categories</CardContent> */}
          </Card>
        )}
      </div>
      {activeFocus !== "none" && (
        <Card className="relative bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 p-4">
          <div
            onClick={() => setActiveFocus("none")}
            className="absolute right-4 cursor-pointer"
          >
            <X />
          </div>
          <ActiveComponent key={activeFocus} componentId={props.componentId} />
        </Card>
      )}
    </div>
  );
}
