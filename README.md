# PetRadar API

API REST construida con NestJS para reportar y encontrar mascotas perdidas usando geolocalización.

## Tecnologias

- **NestJS** - framework principal
- **PostgreSQL + PostGIS** - base de datos con soporte geoespacial
- **Redis** - cache para endpoints GET
- **Docker** - contenerizacion
- **Azure Application Insights** - monitoreo y telemetria

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/lost-pets` | Registrar mascota perdida |
| GET | `/api/lost-pets` | Listar mascotas perdidas activas (con cache) |
| POST | `/api/found-pets` | Reportar mascota encontrada + busqueda por radio 500m |
| GET | `/api/found-pets` | Listar mascotas encontradas (con cache) |

## Busqueda por radio

Al crear un registro en `POST /api/found-pets`, el sistema busca automaticamente mascotas perdidas activas dentro de un radio de **500 metros** usando `ST_DWithin` de PostGIS.

## Requisitos

- Node.js 18+
- Docker y Docker Compose

## Como correr el proyecto

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Levantar base de datos y Redis
docker compose up -d

# 3. Instalar dependencias
npm install

# 4. Correr en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api`

## Docker

```bash
# Construir imagen
docker build -t petradar-api .

# Correr contenedor
docker run -p 3000:3000 --env-file .env petradar-api
```
