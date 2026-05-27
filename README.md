# AutoDealer Demo

App demo de catálogo de autos con Next.js 15, Supabase y shadcn/ui.

## Stack

- **Next.js 15** (App Router, TypeScript, Tailwind CSS v4, Turbopack)
- **Supabase** (Postgres + Auth + Storage)
- **@supabase/ssr** para manejo de sesiones con cookies
- **shadcn/ui** + **lucide-react** + **sonner**

## Setup local

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd practica
npm install
```

### 2. Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

```bash
cp .env.local.example .env.local
```

| Variable | Dónde obtenerla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `NEXT_PUBLIC_ADMIN_USER_ID` | Supabase → Auth → Users → copia el UUID del usuario admin |

### 3. Supabase (ya configurado)

- Tabla `cars` con RLS habilitada
- Bucket `car-images` público con políticas de upload configuradas
- Signups deshabilitados (Settings → Auth → Sign up → desactivar)

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Agrega las variables de entorno en Settings → Environment Variables
3. Deploy — Vercel detecta Next.js automáticamente

## Estructura

```
app/
  page.tsx              # Catálogo público (Server Component)
  login/page.tsx        # Login admin
  admin/
    layout.tsx          # Header admin
    page.tsx            # Tabla de autos
    new/page.tsx        # Crear auto
    edit/[id]/page.tsx  # Editar auto
  auth/signout/route.ts # Logout handler
components/
  car-card.tsx          # Card pública
  car-form.tsx          # Formulario crear/editar
  image-upload.tsx      # Upload múltiple a Storage
  delete-car-button.tsx # Botón eliminar con confirmación
  logout-button.tsx     # Logout
lib/supabase/
  client.ts             # Browser client
  server.ts             # Server client (cookies)
  middleware.ts         # updateSession helper
middleware.ts           # Protege /admin
types/database.ts       # Tipos Car, CarInsert
```
