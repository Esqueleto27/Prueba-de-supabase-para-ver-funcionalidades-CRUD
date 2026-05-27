import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteCarButton } from "@/components/delete-car-button";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
        Error al cargar los autos: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Inventario</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {cars?.length ?? 0} {(cars?.length ?? 0) === 1 ? "vehículo registrado" : "vehículos registrados"}
          </p>
        </div>
        <Link href="/admin/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5 rounded-lg font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo auto
          </Button>
        </Link>
      </div>

      {!cars || cars.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <span className="text-3xl">🚗</span>
          </div>
          <h3 className="text-base font-semibold text-slate-700">Todavía no hay autos</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Empezá agregando el primer vehículo al catálogo.</p>
          <Link href="/admin/new">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold">
              + Agregar primer auto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-20 text-xs font-semibold text-slate-500 uppercase tracking-wide">Foto</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehículo</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Marca</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Año</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Color</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio</TableHead>
                <TableHead className="w-28 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => {
                const mainImage = car.images?.[0] ?? null;
                const formattedPrice = car.price
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(car.price)
                  : null;

                return (
                  <TableRow key={car.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 ring-1 ring-slate-200">
                        {mainImage ? (
                          <Image
                            src={mainImage}
                            alt={car.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300 text-xs font-medium">
                            N/A
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-slate-900 text-sm">{car.name}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{car.brand}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{car.year}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-medium">{car.color}</Badge>
                    </TableCell>
                    <TableCell>
                      {formattedPrice ? (
                        <span className="text-sm font-bold text-slate-900">{formattedPrice}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/edit/${car.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <DeleteCarButton
                          carId={car.id}
                          carName={car.name}
                          images={car.images ?? []}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
