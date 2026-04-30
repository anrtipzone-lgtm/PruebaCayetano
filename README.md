# Gestión de Casas

Sistema web para gestionar un catálogo de propiedades inmobiliarias.

## Estructura del proyecto

```
PruebaCayetano/
├── frontend/   # Aplicación Next.js
└── backend/    # Funciones Lambda en AWS
```

## Tecnologías

**Frontend**
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- TanStack Table — paginación, búsqueda y ordenamiento
- React Hook Form — formularios y validación
- SweetAlert2 — alertas y confirmaciones

**Backend**
- AWS API Gateway + AWS Lambda

**Despliegue**
- Frontend: Vercel
- Backend: AWS

## Correr el frontend localmente

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Despliegue

```bash
cd frontend
vercel --prod
```
