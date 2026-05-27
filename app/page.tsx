import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CarCard } from "@/components/car-card";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">AutoDealer Demo</span>
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <div className="text-center py-20 text-red-500">
            Error al cargar los autos. Intenta más tarde.
          </div>
        ) : !cars || cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🚗</p>
            <h2 className="text-xl font-semibold text-gray-700">No hay autos disponibles</h2>
            <p className="text-gray-400 mt-2">Vuelve pronto, pronto habrá nuevos modelos.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Autos disponibles
              <span className="ml-2 text-sm font-normal text-gray-400">({cars.length})</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
