# Guía de Despliegue — RegistraduriaFront

Este documento describe el despliegue de **RegistraduriaFront** (aplicación Angular) en el VM de frontends compartido con VotacionFront.

---

## Infraestructura Completa del Sistema

| Servicio               | VM Producción    | VM QA            | Puerto |
|------------------------|------------------|------------------|--------|
| **RegistraduriaFront** | `10.43.97.237`   | `10.43.97.232`   | `80`   |
| VotacionFront          | `10.43.97.237`   | `10.43.97.232`   | `4201` |
| RegistraduriaBack      | `10.43.100.131`  | `10.43.99.3`     | `8080` |
| VotacionBack           | `10.43.100.131`  | `10.43.99.3`     | `8081` |
| PostgreSQL             | `10.43.101.13`   | `10.43.98.254`   | `5432` |
| CouchDB                | `10.43.101.13`   | `10.43.98.254`   | `5984` |

> Todos los servicios corren como **contenedores Docker**. Los dos frontends comparten la VM de frontends en puertos distintos (80 y 4201); los dos backends comparten otro VM (8080 y 8081); las bases de datos comparten un tercer VM.

El acceso externo se realiza mediante **Cloudflare Quick Tunnel** (URL temporal generada automáticamente en cada arranque).

---

## Acceso a los VMs

### SSH

```bash
ssh estudiante@10.43.101.13    # VM Bases de datos
ssh estudiante@10.43.100.131   # VM Backends
ssh estudiante@10.43.97.237    # VM Frontends
```

En Windows, abrir **PowerShell** o **CMD** para usar `ssh` (ya viene instalado en Windows 10/11).

### Escritorio Remoto (RDP / xrdp)

1. `Win + R` → `mstsc` → ingresar la IP del VM deseado
2. Usuario: `estudiante`, contraseña del VM
3. Abrir una terminal desde el escritorio

---

## Pre-requisitos

Antes de desplegar RegistraduriaFront, asegurarse de que:

1. **VM de BDs (`10.43.101.13`):** PostgreSQL corriendo en el puerto 5432.
2. **VM Backend (`10.43.100.131`):** RegistraduriaBack corriendo en el puerto 8080.
   → Ver `DEPLOY.md` en el repositorio `Vote4TechRegistraduriaBack`.
3. **VM Frontend (`10.43.97.237`):** Docker instalado, puerto 80 libre.

Detener el nginx del sistema si está activo (solo la primera vez):

```bash
ssh estudiante@10.43.97.237
sudo systemctl stop nginx
sudo systemctl disable nginx
```

---

## Paso 1 — RegistraduriaFront (`10.43.97.237`, puerto 80)

Conectarse por SSH al VM de frontends:

```bash
ssh estudiante@10.43.97.237
```

### 1.1 Subir el código

**Opción A — git:**

```bash
cd ~
git clone <URL_DEL_REPOSITORIO> Vote4TechRegistraduriaFront
# o si ya existe:
cd ~/Vote4TechRegistraduriaFront && git pull
```

**Opción B — PowerShell local (Windows):**

```powershell
robocopy "C:\ruta\al\Vote4TechRegistraduriaFront" "$env:TEMP\rfront-deploy" /E /XD node_modules .angular
scp -r "$env:TEMP\rfront-deploy" estudiante@10.43.97.237:~/Vote4TechRegistraduriaFront
```

### 1.2 Levantar los contenedores

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml up -d --build
```

Verificar que los contenedores están corriendo:

```bash
docker ps
```

Deben aparecer dos contenedores: `vote4tech-front` y `vote4tech-cloudflared`.

> **Nota:** VotacionFront también corre en este mismo VM en el puerto 4201 con sus propios contenedores (`vote4tech-votacion-front` y `vote4tech-votacion-cloudflared`). Los dos frontends son independientes y no se interfieren.

---

## Paso 2 — Obtener el URL de Cloudflare

Obtener el URL generado por el túnel de RegistraduriaFront:

```bash
docker logs vote4tech-cloudflared 2>&1 | grep trycloudflare
```

El URL tiene la forma `https://xxxx-xxxx-xxxx-xxxx.trycloudflare.com`.

### 2.1 Actualizar CORS en RegistraduriaBack

Conectarse al VM Backend y editar `docker/docker-compose.prod.yml`:

```bash
ssh estudiante@10.43.100.131
nano ~/Vote4TechRegistraduriaBack/docker/docker-compose.prod.yml
```

Actualizar `CORS_ALLOWED_ORIGINS`:

```yaml
CORS_ALLOWED_ORIGINS: "http://10.43.97.237,https://NUEVO_URL.trycloudflare.com"
```

Reconstruir el backend:

```bash
cd ~/Vote4TechRegistraduriaBack
docker compose -f docker/docker-compose.prod.yml up -d --build
```

---

## Paso 3 — Verificar el despliegue

Desde el VM Frontend, verificar que el API gateway de nginx funciona:

```bash
curl http://localhost/api/eleccion/elecciones
```

Debe devolver un JSON con las elecciones. Si devuelve HTML de Angular, revisar `docker/nginx.conf`.

Verificar acceso externo desde un navegador:

```
https://xxxx-xxxx-xxxx-xxxx.trycloudflare.com
```

---

## Actualizar el Despliegue con Nuevos Cambios

Conectarse al VM Frontend (`10.43.97.237`):

**Opción A — git:**

```bash
cd ~/Vote4TechRegistraduriaFront
git pull
docker compose -f docker/docker-compose.prod.yml up -d --build
```

**Opción B — código manual (desde PowerShell local):**

```powershell
robocopy "C:\ruta\al\Vote4TechRegistraduriaFront" "$env:TEMP\rfront-deploy" /E /XD node_modules .angular
scp -r "$env:TEMP\rfront-deploy" estudiante@10.43.97.237:~/Vote4TechRegistraduriaFront
```

Luego en el VM:

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml up -d --build
```

> `--build` es obligatorio. Sin él, Docker usa la imagen cacheada y los cambios no se aplican.

---

## Ambiente QA

El ambiente QA usa VMs distintas. Los pasos son idénticos, cambiando solo las IPs.

| Servicio               | VM Producción    | VM QA            | Puerto |
|------------------------|------------------|------------------|--------|
| RegistraduriaFront     | `10.43.97.237`   | `10.43.97.232`   | `80`   |
| VotacionFront          | `10.43.97.237`   | `10.43.97.232`   | `4201` |
| RegistraduriaBack      | `10.43.100.131`  | `10.43.99.3`     | `8080` |
| VotacionBack           | `10.43.100.131`  | `10.43.99.3`     | `8081` |
| PostgreSQL             | `10.43.101.13`   | `10.43.98.254`   | `5432` |
| CouchDB                | `10.43.101.13`   | `10.43.98.254`   | `5984` |

### Cambios en VM Frontend QA (`10.43.97.232`)

En `docker/nginx.conf`, cambiar el `proxy_pass`:

```nginx
# De:
proxy_pass http://10.43.100.131:8080/;
# A:
proxy_pass http://10.43.99.3:8080/;
```

Reconstruir:

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml up -d --build
```

Obtener el URL de Cloudflare QA:

```bash
docker logs vote4tech-cloudflared 2>&1 | grep trycloudflare
```

Actualizar `CORS_ALLOWED_ORIGINS` en el backend QA con este URL y `http://10.43.97.232`.

---

## Troubleshooting

### Puerto 80 ocupado (nginx del sistema)

```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
sudo ss -tlnp | grep :80
```

### El contenedor del frontend no levanta

```bash
docker logs vote4tech-front --tail=50
```

Si falla al iniciar nginx, verificar que `docker/nginx.conf` tiene el `proxy_pass` correcto.

### El API gateway devuelve 502 Bad Gateway

El backend no está respondiendo. Verificar desde el VM Frontend:

```bash
curl http://10.43.100.131:8080/eleccion/elecciones
```

Si no responde, revisar los logs del backend en `10.43.100.131`.

### El URL de Cloudflare cambió

El URL cambia cada vez que el contenedor `vote4tech-cloudflared` se reinicia.

1. Obtener el nuevo URL: `docker logs vote4tech-cloudflared 2>&1 | grep trycloudflare`
2. Actualizar `CORS_ALLOWED_ORIGINS` en `docker/docker-compose.prod.yml` de RegistraduriaBack
3. Reconstruir RegistraduriaBack: `docker compose -f docker/docker-compose.prod.yml up -d --build`

### Reiniciar sin reconstruir

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml restart
```

### Reconstruir completamente

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```
