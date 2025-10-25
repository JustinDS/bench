"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

import { Components } from "@/lib/types/database/components";

const componentSchema = z.object({
  name: z.coerce.string<string>(),
});

type ComponentFormData = z.infer<typeof componentSchema>;

export default function ComponentManager() {
  const supabase = createClient();
  const [components, setComponents] = useState<Components[]>([]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<ComponentFormData>({
    resolver: zodResolver(componentSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: components } = await supabase
        .from("components")
        .select("id, name");
      setComponents(components ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: ComponentFormData) => {
    const { data: insertedData, error } = await supabase
      .from("components")
      .insert({ name: data.name })
      .select()
      .single();

    if (error || !insertedData) {
      console.error(error);
      return alert("Error creating component");
    }

    setComponents((prev) => [...prev, insertedData]);
    reset(); // clears the input
    alert("Component added successfully!");
  };

  return (
    <div>
      <div>
        Current components:
        {components.map((x, i) => {
          return <div key={i}>{x.name}</div>;
        })}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <div>
          <Label>Component Name</Label>
          <Input {...register("name")} placeholder="CPU, GPU, RAM" />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Component"}
        </Button>
      </form>
    </div>
  );
}
