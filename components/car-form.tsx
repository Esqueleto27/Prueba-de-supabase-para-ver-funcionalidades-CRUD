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
      newErrors.year = `Entre 1900 y ${CURRENT_YEAR + 1}`;
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
        const { error } = await supabase.from("cars").update(form).eq("id", initialData.id);
        if (error) throw error;
        toast.success("Auto actualizado correctamente");
      } else {
        const { error } = await supabase.from("cars").insert({ ...form, id: stableId });
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Section: Info básica */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Información del vehículo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Nombre" required error={errors.name}>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Toyota Corolla GR"
              className="h-10"
            />
          </Field>

          <Field label="Marca" required error={errors.brand}>
            <Input
              id="brand"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Toyota"
              className="h-10"
            />
          </Field>

          <Field label="Color" required error={errors.color}>
            <Input
              id="color"
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="Rojo"
              className="h-10"
            />
          </Field>

          <Field label="Año" required error={errors.year}>
            <Input
              id="year"
              type="number"
              value={form.year}
              onChange={(e) => set("year", parseInt(e.target.value, 10))}
              min={1900}
              max={CURRENT_YEAR + 1}
              className="h-10"
            />
          </Field>

          <Field label="Precio (USD)" error={undefined} className="sm:col-span-2 sm:max-w-xs">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
              <Input
                id="price"
                type="number"
                value={form.price ?? ""}
                onChange={(e) => set("price", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="25000"
                min={0}
                className="h-10 pl-7"
              />
            </div>
          </Field>
        </div>
      </div>

      {/* Section: Descripción */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Descripción
        </h3>
        <Textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value || null)}
          placeholder="Detalles del vehículo: equipamiento, kilómetros, estado..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Section: Imágenes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Imágenes
        </h3>
        <ImageUpload
          carId={stableId}
          value={form.images}
          onChange={(urls) => set("images", urls)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <Button
          type="submit"
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold h-10 px-6 rounded-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Guardando...
            </span>
          ) : isEdit ? "Guardar cambios" : "Crear auto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          disabled={loading}
          className="h-10 px-6 rounded-lg font-semibold"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-blue-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
