"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  carId: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

function extractStoragePath(url: string): string {
  const marker = "/car-images/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : "";
}

export function ImageUpload({ carId, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    if (!files.length) return;
    setUploading(true);

    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const timestamp = Date.now();
      const path = `${carId}/${timestamp}-${file.name}`;

      const { error } = await supabase.storage
        .from("car-images")
        .upload(path, file, { upsert: false });

      if (error) {
        toast.error(`Error subiendo ${file.name}: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from("car-images").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
  }

  async function handleRemove(url: string) {
    const supabase = createClient();
    const path = extractStoragePath(url);

    if (path) {
      const { error } = await supabase.storage.from("car-images").remove([path]);
      if (error) {
        toast.error("Error al eliminar imagen");
        return;
      }
    }

    onChange(value.filter((u) => u !== url));
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          {uploading ? "Subiendo..." : "Arrastra imágenes aquí o haz clic para seleccionar"}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square">
              <Image src={url} alt="preview" fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
