// "use client";

// import { Component, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/app/components/ui/button";
// import { Input } from "@/app/components/ui/input";
// import { Label } from "@/app/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/app/components/ui/select";
// import { Manufacturers } from "@/lib/types/database/manufacturers";
// import { Models } from "@/lib/types/database/models";
// import { PartnerSeries } from "@/lib/types/database/PartnerSeries";
// import { Products } from "@/lib/types/database/products";

// const gpuVariantSchema = z.object({
//   product_id: z.coerce.number<number>().min(1),
//   memory_type: z.coerce.string<string>().min(1),
//   vram_gb: z.coerce.number<number>().min(1),
//   core_clock_mhz: z.coerce.number<number>().min(1),
//   boost_clock_mhz: z.coerce.number<number>().min(1),
//   power_draw_watts: z.coerce.number<number>().min(1),
// });

// type GpuVariantFormData = z.infer<typeof gpuVariantSchema>;

// export default function ProductsManager() {
//   const supabase = createClient();
//   const [products, setProducts] = useState<Products[]>([]);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { isSubmitting, errors },
//   } = useForm<GpuVariantFormData>({
//     resolver: zodResolver(gpuVariantSchema),
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       const { data: products } = await supabase
//         .from("products")
//         .select("id, manufacturer_id, model_id, partner_series_id, name");

//       setProducts(products ?? []);
//     };
//     loadData();
//   }, []);

//   const onSubmit = async (data: GpuVariantFormData) => {
//     const { data: modelData, error: modelError } = await supabase
//       .from("gpu_variants")
//       .insert({
//         product_id: data.product_id,
//         memory_type: data.memory_type,
//         vram_gb: data.vram_gb,
//         core_clock_mhz: data.core_clock_mhz,
//         boost_clock_mhz: data.boost_clock_mhz,
//         power_draw_watts: data.power_draw_watts,
//       })
//       .select()
//       .single();

//     if (modelError) {
//       console.error(modelError);
//       return alert("Error inserting Gpu Variant");
//     }

//     setProducts((prev) => [...prev, modelData]);

//     alert("Gpu Variant added successfully!");
//   };

//   return (
//     <>
//       <div>
//         Products:
//         {products.map((x, i) => {
//           return <div key={i}>{x.name}</div>;
//         })}
//       </div>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="max-w-lg space-y-4 pt-5"
//       >
//         <div>
//           <Label>Manufacturer</Label>
//           <Select
//             onValueChange={(val) => setValue("manufacturer_id", Number(val))}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select Manufacturer" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               {manufacturer.map((v) => (
//                 <SelectItem key={v.id} value={String(v.id)}>
//                   {v.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {selectedManufacturer && (
//           <div>
//             <Label>Partner Series</Label>
//             <Select
//               onValueChange={(val) =>
//                 setValue("partner_series_id", Number(val))
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Partner Series" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 {filteredPartnerSeries.map((v) => (
//                   <SelectItem key={v.id} value={String(v.id)}>
//                     {v.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         {selectedPartnerSeries && (
//           <div>
//             <Label>Model</Label>
//             <Select onValueChange={(val) => setValue("model_id", Number(val))}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Model" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 {models.map((v) => (
//                   <SelectItem key={v.id} value={String(v.id)}>
//                     {v.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         {selectedManufacturer && selectedPartnerSeries && selectedModel && (
//           <div>
//             <Label>Product Name</Label>
//             <Input
//               {...register("name")}
//               placeholder="GeForce, Radeon, Ryzen 9, Core i9, etc."
//               value={`${
//                 manufacturer.find((x) => x.id === selectedManufacturer)?.name
//               } ${
//                 partnerSeries.find((x) => x.id === selectedPartnerSeries)?.name
//               } ${models.find((x) => x.id === selectedModel)?.name}`}
//             />
//           </div>
//         )}

//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Adding..." : "Add Series"}
//         </Button>
//       </form>
//     </>
//   );
// }
