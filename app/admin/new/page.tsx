import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarForm } from "@/components/car-form";

export default function NewCarPage() {
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
        <h2 className="text-2xl font-extrabold text-slate-900">Nuevo auto</h2>
        <p className="text-sm text-slate-400 mt-0.5">Completá los datos del vehículo para publicarlo.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <CarForm />
      </div>
    </div>
  );
}
