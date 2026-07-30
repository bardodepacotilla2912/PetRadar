# 🐾 PetRadar API

API REST construida con **NestJS** para reportar mascotas perdidas y encontradas, y conectarlas automáticamente mediante búsqueda geoespacial por radio.

**Autor:** Abraham Rodríguez Contreras

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL%20%2B%20PostGIS-336791?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## ¿Qué resuelve?

Cuando alguien pierde una mascota y otra persona la encuentra, normalmente no tienen forma de cruzar esa información. PetRadar automatiza ese cruce: al registrar una mascota **encontrada**, el sistema busca en tiempo real reportes de mascotas **perdidas** dentro de un radio de 500 metros y los devuelve como posibles coincidencias.

## Tecnologías

- **NestJS** — framework principal (arquitectura modular por dominio)
- **PostgreSQL + PostGIS** — persistencia con soporte geoespacial nativo
- **TypeORM** — ORM y migraciones
- **Redis** — cache de endpoints de lectura
- **Docker / Docker Compose** — contenerización local y despliegue
- **Azure Application Insights** — monitoreo y telemetría en producción
- **GitHub Actions** — build y publicación automática de la imagen a GHCR en cada push a `main`

## Arquitectura

```
src/
├── lost-pets/     # Reportes de mascotas perdidas
├── found-pets/     # Reportes de mascotas encontradas + matching por radio
├── cache/          # Capa de cache sobre Redis
├── core/           # Entidades, DTOs y configuración de base de datos
└── conf/           # Variables de entorno y logger
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/lost-pets` | Registrar una mascota perdida |
| `GET` | `/api/lost-pets` | Listar mascotas perdidas activas (cacheado) |
| `POST` | `/api/found-pets` | Reportar una mascota encontrada — dispara la búsqueda por radio |
| `GET` | `/api/found-pets` | Listar mascotas encontradas (cacheado) |

### Búsqueda por radio

Al crear un registro en `POST /api/found-pets`, el sistema busca automáticamente mascotas perdidas activas dentro de un radio de **500 metros** usando `ST_DWithin` de PostGIS sobre coordenadas `geometry(Point, 4326)`.

## Cómo correr el proyecto

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/bardodepacotilla2912/PetRadar.git
cd PetRadar

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar PostgreSQL/PostGIS y Redis
docker compose up -d

# 4. Instalar dependencias
npm install

# 5. Correr en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api`.

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto donde corre la API |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión a PostgreSQL/PostGIS |
| `REDIS_HOST`, `REDIS_PORT` | Conexión a Redis |
| `APPINSIGHTS_CONNECTION_STRING` | Telemetría en Azure Application Insights |

## Docker

```bash
# Construir imagen
docker build -t petradar-api .

# Correr contenedor
docker run -p 3000:3000 --env-file .env petradar-api
```

Cada push a `main` publica automáticamente la imagen en GitHub Container Registry vía GitHub Actions.

## Testing

```bash
npm run test       # unitarios
npm run test:e2e   # end-to-end
npm run test:cov   # cobertura
```

## Licencia

MIT
