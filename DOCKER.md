# 🐳 Guía de Despliegue con Docker

Esta guía te ayudará a desplegar la aplicación de Gestión de Pacientes usando Docker y Docker Compose.

## 📋 Prerrequisitos

- Docker 20.10 o superior
- Docker Compose 2.0 o superior
- Mínimo 2GB de RAM disponible
- Puerto 3000 y 5432 disponibles

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales seguras:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro_aqui
POSTGRES_DB=patients
DATABASE_URL=postgresql://postgres:tu_password_seguro_aqui@postgres:5432/patients
```

### 2. Construir y Levantar Servicios

```bash
# Construir imágenes y levantar contenedores
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo de la app
docker-compose logs -f app
```

### 3. Verificar Estado

```bash
# Ver contenedores en ejecución
docker-compose ps

# Verificar health de la aplicación
curl http://localhost:3000/api/health

# Verificar PostgreSQL
docker-compose exec postgres pg_isready -U postgres
```

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ ELIMINA DATOS)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart app

# Reconstruir imagen después de cambios en código
docker-compose up -d --build app
```

### Logs y Debugging

```bash
# Ver últimas 100 líneas de logs
docker-compose logs --tail=100 app

# Seguir logs en tiempo real
docker-compose logs -f app

# Ver logs desde un tiempo específico
docker-compose logs --since 30m app
```

### Ejecutar Comandos en Contenedores

```bash
# Acceder a shell del contenedor de app
docker-compose exec app sh

# Ejecutar migraciones manualmente
docker-compose exec app npx prisma migrate deploy

# Ver estado de migraciones
docker-compose exec app npx prisma migrate status

# Poblar base de datos con datos de ejemplo
docker-compose exec app npx prisma db seed

# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d patients
```

## 📊 Estructura de Contenedores

### Servicio `postgres`

- **Imagen**: `postgres:16-alpine`
- **Puerto**: 5432
- **Volumen**: `patients_data` (persistencia de datos)
- **Red**: `patients_network`
- **Health Check**: Verifica `pg_isready` cada 10s

### Servicio `app`

- **Build**: Dockerfile multi-stage
- **Puerto**: 3000
- **Red**: `patients_network`
- **Depende de**: `postgres` (espera a que esté healthy)
- **Health Check**: Verifica endpoint `/api/health` cada 30s

## 🔒 Seguridad

### Recomendaciones de Producción

1. **Cambiar Credenciales por Defecto**

   ```env
   POSTGRES_PASSWORD=UnPasswordMuySeguro123!@#
   ```

2. **Usar Secrets de Docker**

   ```bash
   echo "mi_password_seguro" | docker secret create db_password -
   ```

3. **Limitar Acceso a Puertos**

   - No exponer PostgreSQL (puerto 5432) públicamente
   - Usar reverse proxy (Nginx, Traefik) para HTTPS

4. **Habilitar SSL en PostgreSQL**
   ```yaml
   command: >
     postgres
     -c ssl=on
     -c ssl_cert_file=/var/lib/postgresql/server.crt
     -c ssl_key_file=/var/lib/postgresql/server.key
   ```

## 🔄 Backup y Restauración

### Hacer Backup de la Base de Datos

```bash
# Backup completo
docker-compose exec postgres pg_dump -U postgres patients > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup comprimido
docker-compose exec postgres pg_dump -U postgres patients | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restaurar Base de Datos

```bash
# Desde archivo SQL
cat backup.sql | docker-compose exec -T postgres psql -U postgres patients

# Desde archivo comprimido
gunzip -c backup.sql.gz | docker-compose exec -T postgres psql -U postgres patients
```

## 📈 Monitoreo

### Verificar Uso de Recursos

```bash
# Ver uso de CPU y memoria
docker stats

# Información detallada de un contenedor
docker inspect patients_app

# Ver logs del sistema
docker-compose logs --tail=50
```

### Health Checks

```bash
# Verificar salud de la aplicación
curl http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "timestamp": "2025-11-21T...",
  "uptime": 123.45
}
```

## 🐛 Troubleshooting

### Problema: El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs app

# Verificar configuración
docker-compose config

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Verificar conectividad
docker-compose exec app ping postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Problema: Migraciones no se aplican

```bash
# Ejecutar migraciones manualmente
docker-compose exec app npx prisma migrate deploy

# Verificar estado
docker-compose exec app npx prisma migrate status

# Reset (⚠️ ELIMINA DATOS)
docker-compose exec app npx prisma migrate reset --force
```

## 🌐 Despliegue en Producción

### 1. Preparar Servidor

```bash
# Instalar Docker en Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clonar Repositorio

```bash
git clone https://github.com/jceballos29/patient-registry.git
cd patient-registry
```

### 3. Configurar para Producción

```bash
# Copiar y editar variables de entorno
cp .env.example .env
nano .env

# Construir y levantar
docker-compose up -d --build

# Verificar logs
docker-compose logs -f
```

### 4. Configurar Nginx (Opcional)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 Variables de Entorno

| Variable            | Descripción                | Valor por Defecto  |
| ------------------- | -------------------------- | ------------------ |
| `POSTGRES_USER`     | Usuario de PostgreSQL      | `postgres`         |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL   | `postgres`         |
| `POSTGRES_DB`       | Nombre de la base de datos | `patients`         |
| `POSTGRES_PORT`     | Puerto de PostgreSQL       | `5432`             |
| `APP_PORT`          | Puerto de la aplicación    | `3000`             |
| `DATABASE_URL`      | URL completa de conexión   | Ver `.env.example` |
| `NODE_ENV`          | Entorno de Node.js         | `production`       |

## 🎯 Checklist de Producción

- [ ] Cambiar credenciales por defecto
- [ ] Configurar backup automático
- [ ] Habilitar HTTPS con certificado SSL
- [ ] Configurar firewall (UFW, iptables)
- [ ] Implementar monitoreo (Prometheus, Grafana)
- [ ] Configurar logs centralizados
- [ ] Establecer límites de recursos Docker
- [ ] Documentar plan de disaster recovery
- [ ] Configurar CI/CD para deploys automáticos

## 📞 Soporte

Si encuentras problemas durante el despliegue, revisa:

1. Logs de los contenedores
2. Variables de entorno
3. Puertos disponibles
4. Recursos del sistema (RAM, CPU, Disco)

Para más ayuda, abre un issue en el repositorio.

---

Desarrollado con ❤️ para facilitar la gestión de pacientes
