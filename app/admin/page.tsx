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
      <div className="text-center py-20 text-red-500">
        Error al cargar los autos: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Autos
        <span className="ml-2 text-sm font-normal text-gray-400">({cars?.length ?? 0})</span>
      </h2>

      {!cars || cars.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-3xl mb-3">🚗</p>
          <p className="text-gray-500">No hay autos aún.</p>
          <Link href="/admin/new">
            <Button className="mt-4">+ Agregar primer auto</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Foto</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => {
                const mainImage = car.images?.[0] ?? null;
                const formattedPrice = car.price
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(car.price)
                  : "—";

                return (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {mainImage ? (
                          <Image
                            src={mainImage}
                            alt={car.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 text-xs">
                            N/A
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{car.name}</TableCell>
                    <TableCell className="text-gray-600">{car.brand}</TableCell>
                    <TableCell className="text-gray-600">{car.year}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{car.color}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formattedPrice}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/edit/${car.id}`}>
                          <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
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
