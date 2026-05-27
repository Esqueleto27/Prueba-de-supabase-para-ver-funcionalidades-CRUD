"use client";

import Image from "next/image";
import { Car } from "@/types/database";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const mainImage = car.images?.[0] ?? null;

  const formattedPrice = car.price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(car.price)
    : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={car.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}
        {/* Year badge */}
        <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {car.year}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-0.5">{car.brand}</p>
          <h3 className="text-base font-bold text-slate-900 leading-snug">{car.name}</h3>

          {car.description && (
            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{car.description}</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            <span
              className="w-2 h-2 rounded-full border border-slate-300 flex-shrink-0"
              style={{ backgroundColor: colorToHex(car.color) }}
            />
            {car.color}
          </span>

          {formattedPrice ? (
            <span className="text-base font-extrabold text-slate-900">{formattedPrice}</span>
          ) : (
            <span className="text-xs text-slate-400 italic">Consultar precio</span>
          )}
        </div>
      </div>
    </div>
  );
}

function colorToHex(name: string): string {
  const map: Record<string, string> = {
    rojo: "#ef4444", red: "#ef4444",
    azul: "#3b82f6", blue: "#3b82f6",
    verde: "#22c55e", green: "#22c55e",
    negro: "#1e293b", black: "#1e293b",
    blanco: "#f1f5f9", white: "#f1f5f9",
    gris: "#94a3b8", gray: "#94a3b8", grey: "#94a3b8",
    amarillo: "#facc15", yellow: "#facc15",
    naranja: "#f97316", orange: "#f97316",
    plateado: "#cbd5e1", silver: "#cbd5e1",
  };
  return map[name.toLowerCase()] ?? "#94a3b8";
}
