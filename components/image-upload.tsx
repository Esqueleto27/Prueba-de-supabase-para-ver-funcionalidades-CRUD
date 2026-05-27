"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, ImageIcon } from "lucide-react";
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
  const [dragOver, setDragOver] = useState(false);

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
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-150 cursor-pointer
          ${dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }
          ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Upload className="h-5 w-5 text-slate-500" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {uploading ? "Subiendo imágenes..." : "Arrastrá o hacé clic para subir"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP — múltiples archivos</p>
          </div>
        </div>
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
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {value.length} {value.length === 1 ? "imagen" : "imágenes"} cargadas
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {value.map((url, idx) => (
              <div
                key={url}
                className="relative group rounded-xl overflow-hidden bg-slate-100 aspect-square ring-1 ring-slate-200"
              >
                <Image src={url} alt={`imagen ${idx + 1}`} fill className="object-cover" sizes="120px" />
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500/90 text-white text-center text-[9px] font-bold py-0.5 uppercase tracking-widest">
                    Principal
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(url); }}
                  className="absolute top-1.5 right-1.5 bg-slate-900/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}

            {/* Add more placeholder */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-500 transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="text-[10px] font-medium">Agregar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
