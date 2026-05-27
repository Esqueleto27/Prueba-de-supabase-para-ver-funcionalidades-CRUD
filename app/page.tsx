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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚘</span>
            <span className="text-lg font-bold text-white tracking-tight">AutoDealer</span>
            <span className="hidden sm:inline text-slate-400 text-sm font-normal ml-1">Demo</span>
          </div>
          <Link
            href="/login"
            className="text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-full transition-all duration-150"
          >
            Acceso Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 text-white pb-16 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Catálogo de vehículos
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Encuentra tu próximo auto
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Explorá nuestra selección de vehículos disponibles, con fotos, precios y toda la información que necesitás.
          </p>
        </div>
      </section>

      {/* Wave divider */}
      <div className="bg-slate-900">
        <svg viewBox="0 0 1440 40" className="w-full block" preserveAspectRatio="none" style={{height: 40}}>
          <path fill="#f8fafc" d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">Error al cargar los autos. Intenta más tarde.</p>
          </div>
        ) : !cars || cars.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-5">
              <span className="text-4xl">🚗</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-700">No hay autos disponibles</h2>
            <p className="text-slate-400 mt-2">Vuelve pronto, pronto habrá nuevos modelos.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">
                Todos los vehículos
                <span className="ml-2 text-base font-normal text-slate-400">
                  ({cars.length} {cars.length === 1 ? "auto" : "autos"})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 mt-10">
        <p className="text-center text-xs text-slate-400">
          AutoDealer Demo — construido con Next.js + Supabase
        </p>
      </footer>
    </div>
  );
}
