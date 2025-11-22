# 🏥 Sistema de Gestión de Pacientes

Sistema completo de gestión de pacientes desarrollado con Next.js 16, diseñado para profesionales de la salud que necesitan llevar un registro organizado de sus pacientes, sesiones y autorizaciones.

## 🚀 Características Principales

- **📋 Gestión de Pacientes**: Registro completo con información personal, tipo de documento y aseguradora
- **📅 Control de Fechas**: Seguimiento de fecha de ingreso y registro temporal de cada paciente
- **💼 Tipos de Consulta**: Soporte para pacientes por sesiones o por autorizaciones
- **🏥 Aseguradoras**: Gestión integrada de aseguradoras con filtros y búsquedas
- **🔍 Búsqueda y Filtros**: Filtrado avanzado por tipo de documento, tipo de consulta y aseguradora
- **📊 Tabla Interactiva**: Ordenamiento, paginación y selección múltiple de registros
- **🎨 UI Moderna**: Interfaz responsive con Tailwind CSS y componentes de shadcn/ui
- **⚡ Optimizado**: Caché de React, reintentos automáticos y manejo robusto de errores
- **🐳 Docker Ready**: Configuración completa para despliegue con Docker y Docker Compose

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 16](https://nextjs.org/) con App Router
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) con [Prisma ORM 7](https://www.prisma.io/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Gestión de Estado**: React Server Actions con `useActionState`
- **Tablas**: [TanStack Table v8](https://tanstack.com/table/latest)
- **Validación**: [Zod 4](https://zod.dev/)
- **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/)
- **Runtime**: Node.js v24.11.0
- **Gestor de Paquetes**: pnpm

## 📦 Requisitos Previos

- **Node.js**: v24.11.0 o superior
- **pnpm**: v8 o superior
- **PostgreSQL**: v14 o superior (o Docker)
- **Docker** (opcional): Para despliegue containerizado

## 🏁 Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jceballos29/patient-registry.git
cd patient-registry
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/patients"

# Prisma
PRISMA_GENERATE_SKIP_AUTOINSTALL=false

# Next.js
NEXT_TELEMETRY_DISABLED=1
```

### 4. Inicializar Base de Datos

```bash
# Ejecutar migraciones
pnpm prisma migrate dev

# Generar Prisma Client
pnpm prisma generate

# (Opcional) Poblar con datos de ejemplo
pnpm prisma db seed
```

### 5. Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🐳 Despliegue con Docker

### Desarrollo Local con Docker Compose

```bash
# Iniciar servicios (PostgreSQL + App)
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down
```

### Producción

```bash
# Build de imagen Docker
docker build -t patient-registry:latest .

# Ejecutar con docker-compose en producción
docker-compose -f docker-compose.yml up -d
```

### Variables de Entorno para Docker

Crea un archivo `.env` para configurar Docker Compose:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=patients
POSTGRES_PORT=5432

# Aplicación
APP_PORT=3000
DATABASE_URL=postgresql://postgres:tu_password_seguro@postgres:5432/patients
```

## 📁 Estructura del Proyecto

```
pacientes/
├── app/                    # App Router de Next.js
│   ├── patients/          # Página de gestión de pacientes
│   ├── error.tsx          # Error boundary global
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── patients/         # Componentes específicos de pacientes
│   └── ui/               # Componentes UI reutilizables (shadcn/ui)
├── lib/                   # Lógica de negocio
│   ├── actions/          # Server Actions
│   ├── generated/        # Prisma Client generado
│   └── utils.ts          # Utilidades y helpers
├── prisma/               # Configuración de Prisma
│   ├── schema.prisma     # Esquema de base de datos
│   ├── seed.ts           # Datos de ejemplo
│   └── migrations/       # Migraciones SQL
├── types/                # Definiciones de tipos TypeScript
├── Dockerfile            # Configuración Docker
├── docker-compose.yml    # Orquestación de servicios
└── .dockerignore         # Archivos excluidos de Docker
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm lint             # Linter ESLint

# Prisma
pnpm prisma generate  # Generar Prisma Client
pnpm prisma migrate dev # Crear y aplicar migración
pnpm prisma db seed   # Poblar base de datos
pnpm prisma studio    # Abrir Prisma Studio (GUI)

# Docker
docker-compose up -d  # Iniciar contenedores
docker-compose down   # Detener contenedores
docker-compose logs -f # Ver logs en tiempo real
```

## 🎯 Características Técnicas Avanzadas

### Optimizaciones de Rendimiento

- **React Cache**: Funciones `getPatients()` y `getInsurers()` cacheadas
- **Reintentos Automáticos**: Sistema de retry para operaciones de base de datos
- **Connection Pool**: Pool de conexiones PostgreSQL optimizado
- **Code Splitting**: Lazy loading automático de Next.js

### Validaciones y Seguridad

- **Zod Schemas**: Validación robusta de datos en servidor
- **Type Safety**: TypeScript estricto en toda la aplicación
- **SQL Injection Protection**: Prisma ORM con consultas parametrizadas
- **Error Boundaries**: Captura y manejo graceful de errores

### Experiencia de Usuario

- **Optimistic Updates**: Actualizaciones instantáneas en UI
- **Loading States**: Skeletons y spinners durante cargas
- **Toast Notifications**: Feedback inmediato de acciones
- **Responsive Design**: Adaptable a todos los dispositivos
- **Accesibilidad**: Componentes con soporte WAI-ARIA

## 🗄️ Modelo de Datos

### Patient (Paciente)

```prisma
model Patient {
  id                    String        @id @default(cuid())
  name                  String
  documentType          DocumentType
  document              String        @unique
  type                  PatientType
  enteredAt             DateTime
  insurerId             String?
  insurer               Insurer?      @relation(fields: [insurerId], references: [id])
  defaultSessionPrice   Decimal?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
}
```

### Insurer (Aseguradora)

```prisma
model Insurer {
  id        String    @id @default(cuid())
  name      String    @unique
  patients  Patient[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código privado. Todos los derechos reservados.

## 👨‍💻 Autor

**Juan Ceballos**

- GitHub: [@jceballos29](https://github.com/jceballos29)
- Repositorio: [patient-registry](https://github.com/jceballos29/patient-registry)

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio.

---

Desarrollado con ❤️ usando Next.js y TypeScript
