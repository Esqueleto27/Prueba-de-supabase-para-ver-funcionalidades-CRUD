"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Car, CarInsert } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";

interface CarFormProps {
  initialData?: Car;
}

const CURRENT_YEAR = new Date().getFullYear();

export function CarForm({ initialData }: CarFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const stableId = initialData?.id ?? crypto.randomUUID();

  const [form, setForm] = useState<CarInsert>({
    name: initialData?.name ?? "",
    brand: initialData?.brand ?? "",
    color: initialData?.color ?? "",
    year: initialData?.year ?? CURRENT_YEAR,
    price: initialData?.price ?? null,
    description: initialData?.description ?? null,
    images: initialData?.images ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CarInsert, string>>>({});

  function set<K extends keyof CarInsert>(key: K, value: CarInsert[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof CarInsert, string>> = {};

    if (!form.name.trim()) newErrors.name = "Requerido";
    if (!form.brand.trim()) newErrors.brand = "Requerido";
    if (!form.color.trim()) newErrors.color = "Requerido";
    if (!form.year) {
      newErrors.year = "Requerido";
    } else if (form.year < 1900 || form.year > CURRENT_YEAR + 1) {
      newErrors.year = `Año debe estar entre 1900 y ${CURRENT_YEAR + 1}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      if (isEdit) {
        const { error } = await supabase
          .from("cars")
          .update(form)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Auto actualizado correctamente");
      } else {
        const { error } = await supabase
          .from("cars")
          .insert({ ...form, id: stableId });

        if (error) throw error;
        toast.success("Auto creado correctamente");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Toyota Corolla GR"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brand">Marca *</Label>
          <Input
            id="brand"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="Toyota"
          />
          {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="color">Color *</Label>
          <Input
            id="color"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="Rojo"
          />
          {errors.color && <p className="text-xs text-red-500">{errors.color}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="year">Año *</Label>
          <Input
            id="year"
            type="number"
            value={form.year}
            onChange={(e) => set("year", parseInt(e.target.value, 10))}
            min={1900}
            max={CURRENT_YEAR + 1}
          />
          {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price">Precio (USD)</Label>
          <Input
            id="price"
            type="number"
            value={form.price ?? ""}
            onChange={(e) =>
              set("price", e.target.value ? parseFloat(e.target.value) : null)
            }
            placeholder="25000"
            min={0}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value || null)}
          placeholder="Detalles del vehículo..."
          rows={4}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Imágenes</Label>
        <ImageUpload
          carId={stableId}
          value={form.images}
          onChange={(urls) => set("images", urls)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : isEdit ? "Actualizar auto" : "Crear auto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
