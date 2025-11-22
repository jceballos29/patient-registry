#!/bin/sh
set -e

echo "🚀 Iniciando aplicación..."

# Esperar a que PostgreSQL esté disponible
echo "⏳ Esperando a PostgreSQL..."
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL no está listo - esperando..."
  sleep 2
done

echo "✅ PostgreSQL está listo"

# Ejecutar migraciones de Prisma
echo "📦 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

echo "✨ Migraciones completadas"

# Iniciar aplicación
echo "🎉 Iniciando servidor Next.js..."
exec node server.js
