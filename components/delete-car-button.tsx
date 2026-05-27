"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteCarButtonProps {
  carId: string;
  carName: string;
  images: string[];
}

function extractStoragePath(url: string): string {
  const marker = "/car-images/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : "";
}

export function DeleteCarButton({ carId, carName, images }: DeleteCarButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();

    if (images.length > 0) {
      const paths = images.map(extractStoragePath).filter(Boolean);
      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("car-images")
          .remove(paths);
        if (storageError) {
          toast.error("Error al eliminar imágenes del storage");
          setLoading(false);
          return;
        }
      }
    }

    const { error } = await supabase.from("cars").delete().eq("id", carId);

    if (error) {
      toast.error("Error al eliminar el auto");
      setLoading(false);
      return;
    }

    toast.success(`"${carName}" eliminado correctamente`);
    router.refresh();
    setLoading(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar auto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará <strong>{carName}</strong> y todas sus imágenes permanentemente.
            No se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
