import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CarForm } from "@/components/car-form";

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !car) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver al inventario
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900">Editar auto</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Modificá los datos de <span className="font-semibold text-slate-600">{car.name}</span>.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <CarForm initialData={car} />
      </div>
    </div>
  );
}
