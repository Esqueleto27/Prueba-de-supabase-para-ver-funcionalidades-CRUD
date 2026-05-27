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
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Editar auto</h2>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <CarForm initialData={car} />
      </div>
    </div>
  );
}
