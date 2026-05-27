"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Car } from "@/types/database";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const mainImage = car.images?.[0] ?? null;

  const formattedPrice = car.price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(car.price)
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={car.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{car.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{car.brand}</p>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary">{car.color}</Badge>
          <span className="text-sm text-gray-500">{car.year}</span>
        </div>

        {formattedPrice && (
          <p className="mt-3 text-xl font-bold text-gray-900">{formattedPrice}</p>
        )}

        {car.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{car.description}</p>
        )}
      </div>
    </div>
  );
}
