# Guía de Despliegue — RegistraduriaFront

Este documento describe **todo lo necesario** para desplegar RegistraduriaFront sin problemas, incluyendo los errores conocidos que ya ocurrieron y cómo resolverlos.

> **RegistraduriaFront** es una aplicación Angular que corre en el VM de frontends (`10.43.97.237`) en el **puerto 8090** (no 80 — ver sección [Problema: Puerto 80 ocupado por nginx del sistema](#problema-puerto-80-ocupado-por-nginx-del-sistema)).

---

## Infraestructura del Sistema

| Servicio               | VM Producción    | Puerto |
|------------------------|------------------|--------|
| **RegistraduriaFront** | `10.43.97.237`   | `8090` |
| VotacionFront          | `10.43.97.237`   | `4201` |
| RegistraduriaBack      | `10.43.100.131`  | `8080` |
| VotacionBack           | `10.43.100.131`  | `8081` |
| PostgreSQL             | `10.43.101.13`   | `5432` |
| CouchDB                | `10.43.101.13`   | `5984` |

Ambos frontends comparten el mismo VM. El acceso externo usa **Cloudflare Quick Tunnel** (URL temporal que cambia cada vez que el contenedor reinicia).

---

## Ejecución Local

> Para probar la aplicación completa sin acceso a los VMs de producción.

### Opción A — Full Docker (un solo comando, recomendado)

El `docker-compose.yml` de la **raíz del workspace** levanta toda la infraestructura local en un solo paso:

```bash
# Desde la carpeta raíz ("Arquitectura de Software")
docker compose up -d
```

| Servicio | URL local | Nota |
|----------|-----------|------|
| **RegistraduriaFront** | http://localhost:4200 | nginx sirve el build Angular |
| VotacionFront | http://localhost:4201 | |
| RegistraduriaBack | http://localhost:**8082** | ⚠ Puerto 8082, no 8080 |
| VotacionBack | http://localhost:8081 | |
| PostgreSQL | localhost:5432 | DB: `vote4tech`, user: `postgres`, pass: `postgres123` |
| CouchDB | localhost:5984 | user: `admin`, pass: `admin123` |

> Las credenciales de BD son **distintas** a producción (`vote4tech`/`postgres`/`postgres123` en local vs. `bd_nacional_vote4tech`/`admin_db_nacional`/`12345` en producción). El seed de datos se ejecuta automáticamente al iniciar los backends por primera vez (si las tablas están vacías).

Para ver los logs de este servicio en local:

```bash
docker compose logs -f registraduria-front
```

Para parar todo:

```bash
docker compose down
# Para borrar también los volúmenes de BD (reset completo):
docker compose down -v
```

---

### Opción B — `ng serve` con hot reload

Útil para desarrollo Angular: los cambios de código se reflejan en el navegador al instante sin reconstruir la imagen Docker.

**Paso 1 — Levantar solo DBs y backend con Docker:**

```bash
# Desde la carpeta raíz del workspace
docker compose up -d postgres registraduria-back
```

RegistraduriaBack queda disponible en `http://localhost:8082`.

**Paso 2 — El archivo `proxy.conf.local.json` ya existe** en la raíz de este proyecto con el siguiente contenido:

```json
{
  "/api": {
    "target": "http://localhost:8082",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

> El `pathRewrite` es **obligatorio**: los controllers del backend no tienen prefijo `/api`
> (`@RequestMapping("/registrador")`, `@RequestMapping("/eleccion")`, etc.).
> El proxy debe eliminar ese prefijo antes de reenviar la petición.
>
> El `proxy.conf.json` original **no se toca** — apunta al VM de producción
> (`10.43.100.131:8080`) y sirve para conectar el `ng serve` al backend del VM directamente.

**Paso 3 — Instalar dependencias y arrancar Angular:**

```bash
cd Vote4TechRegistraduriaFront
npm install
ng serve --proxy-config proxy.conf.local.json
```

Abre http://localhost:4200.

> ⚠ El flag `--proxy-config proxy.conf.local.json` es **obligatorio**.
> El archivo `angular.json` de este proyecto **no tiene** `proxyConfig` configurado
> en la sección `serve`, por lo que Angular no sabe que debe usar el proxy
> a menos que se pase explícitamente por línea de comandos.
> Sin ese flag, todas las llamadas a `/api` fallan con error de red (CORS o conexión rechazada).

**Alternativa — conectar `ng serve` directamente al VM de producción:**

Si el VM `10.43.100.131` es accesible desde tu máquina, puedes usar el proxy original sin cambios:

```bash
ng serve --proxy-config proxy.conf.json
```

---

## Archivos con Fixes Críticos

> Estos archivos tienen correcciones obligatorias que **no están en el repositorio Git**. Deben copiarse manualmente con `scp` después de clonar. Sin ellos el login no funciona.

| Archivo | Fix aplicado |
|---------|-------------|
| `src/app/app.config.ts` | Agrega `withInterceptorsFromDi()` para que el interceptor JWT funcione |
| `src/app/shared/services/auth-state.service.ts` | Usa `responseType: 'text'` en los 3 métodos de login |
| `docker/docker-compose.prod.yml` | Puerto cambiado de 80 a 8090 |

**¿Por qué son necesarios?**

- **`app.config.ts`**: Angular 17+ ignora silenciosamente los interceptores HTTP basados en clase (`HTTP_INTERCEPTORS`) si no se llama `withInterceptorsFromDi()` en `provideHttpClient(...)`. Sin este fix, el token JWT nunca se adjunta a las peticiones → 401 en todas las llamadas autenticadas.
- **`auth-state.service.ts`**: El backend devuelve el JWT como `text/plain` (`ResponseEntity<String>` en Spring sin `produces="application/json"`). Si Angular intenta parsearlo como JSON falla con `Http failure during parsing` status 200. Con `responseType: 'text'` lee el cuerpo directamente como string.

---

## Despliegue Completo (Primera Vez)

### Prerequisitos

- El VM de backends (`10.43.100.131`) ya tiene RegistraduriaBack corriendo en el puerto 8080.
- El VM de BDs (`10.43.101.13`) ya tiene PostgreSQL corriendo.
- Acceso SSH al VM `10.43.97.237`.

### Paso 1 — Limpiar contenedores anteriores (VM `10.43.97.237`)

Si hay contenedores de una versión anterior, eliminarlos primero:

```bash
docker rm -f vote4tech-front vote4tech-cloudflared
```

Si el comando da error diciendo que no existen, no importa — continuar.

### Paso 2 — Clonar el repositorio (VM `10.43.97.237`)

```bash
cd ~
git clone https://github.com/Zyntech-PUJ/Vote4TechRegistraduriaFront.git
```

Si la carpeta ya existe:

```bash
cd ~/Vote4TechRegistraduriaFront
git pull
```

### Paso 3 — Copiar los archivos con fixes (desde tu PC, PowerShell)

Ejecutar estos 3 comandos en PowerShell local. Reemplaza la ruta base si tu workspace está en otro lugar:

```powershell
$base = "C:\Users\javie\OneDrive\Documentos\unijaveriana\SEMESTRE 7\Arquitectura de Software\Vote4TechRegistraduriaFront"

scp "$base\src\app\app.config.ts" estudiante@10.43.97.237:~/Vote4TechRegistraduriaFront/src/app/app.config.ts

scp "$base\src\app\shared\services\auth-state.service.ts" estudiante@10.43.97.237:~/Vote4TechRegistraduriaFront/src/app/shared/services/auth-state.service.ts

scp "$base\docker\docker-compose.prod.yml" estudiante@10.43.97.237:~/Vote4TechRegistraduriaFront/docker/docker-compose.prod.yml
```

> Si `scp` pide contraseña, ingresar la del VM.

### Paso 4 — Construir y levantar (VM `10.43.97.237`)

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml up -d --build
```

La primera vez tarda 5-10 minutos (descarga Node, compila Angular). Para ver el progreso:

```bash
docker logs -f vote4tech-front
```

Verificar que ambos contenedores están corriendo:

```bash
docker ps
```

Deben aparecer: `vote4tech-front` (puerto 8090) y `vote4tech-cloudflared`.

### Paso 5 — Obtener la URL de Cloudflare

```bash
docker logs vote4tech-cloudflared 2>&1 | grep trycloudflare
```

La URL tiene la forma `https://xxxx-xxxx-xxxx-xxxx.trycloudflare.com`. Anotarla — se necesita en el siguiente paso.

### Paso 6 — Actualizar CORS en RegistraduriaBack

> Este paso es **obligatorio** cada vez que la URL de Cloudflare cambie. Sin él el navegador bloquea todas las peticiones API con error CORS.

**Desde tu PC (PowerShell)** — editar el compose del backend y copiarlo al VM:

En el archivo `C:\...\Vote4TechRegistraduriaBack\docker\docker-compose.prod.yml`, actualizar la línea:

```yaml
CORS_ALLOWED_ORIGINS: "http://10.43.97.237:8090,https://TU_NUEVA_URL.trycloudflare.com"
```

Luego subir el archivo al VM de backends:

```powershell
$base = "C:\Users\javie\OneDrive\Documentos\unijaveriana\SEMESTRE 7\Arquitectura de Software\Vote4TechRegistraduriaBack"
scp "$base\docker\docker-compose.prod.yml" estudiante@10.43.100.131:~/Vote4TechRegistraduriaBack/docker/docker-compose.prod.yml
```

En el VM de backends (`10.43.100.131`), reiniciar el contenedor para que tome el nuevo env var:

```bash
cd ~/Vote4TechRegistraduriaBack
docker compose -f docker/docker-compose.prod.yml up -d
```

> No hace falta `--build` en este caso — solo recrea el contenedor con el nuevo entorno.

### Paso 7 — Verificar el login

Abrir en el navegador: `https://TU_URL.trycloudflare.com/login`

Usar las credenciales del seed:
- Registrador: `test123` / `12345`
- Admin Electoral: `adminElectoral` / `admin2026`
- Consejo Nacional: `consejoNacional` / `consejo2026`

---

## Actualizar con Nuevos Cambios de Código

Si solo cambia código Angular (sin cambiar los archivos de fix):

```bash
# En el VM 10.43.97.237
cd ~/Vote4TechRegistraduriaFront
git pull
docker compose -f docker/docker-compose.prod.yml up -d --build
```

Si cambia alguno de los archivos con fix (app.config.ts, auth-state.service.ts, docker-compose.prod.yml), volver a copiarlos con `scp` antes del `--build`.

> **Importante:** `--build` es siempre obligatorio para reconstruir la imagen. Sin él Docker usa la imagen cacheada y los cambios de código no se aplican.

---

## Problemas Conocidos y Soluciones

### Problema: Puerto 80 ocupado por nginx del sistema

**Síntoma:** El contenedor `vote4tech-front` falla al iniciar con error `bind: address already in use`.

**Causa:** En los VMs de la universidad, nginx viene instalado como servicio del sistema (`systemd`) y ocupa el puerto 80. Aunque se ejecute `sudo systemctl stop nginx`, nginx vuelve a arrancar automáticamente. `pkill -9 nginx` tampoco funciona de forma permanente porque systemd lo reinicia.

**Solución definitiva:** Usar el puerto **8090** en lugar de 80. El archivo `docker/docker-compose.prod.yml` ya está configurado así:

```yaml
services:
  frontend:
    ports:
      - "8090:80"
  cloudflared:
    command: tunnel --no-autoupdate --url http://localhost:8090
```

El nginx del sistema sigue en el 80 sin interferir. Cloudflare expone el puerto 8090 públicamente.

> **No intentar matar el nginx del sistema.** `sudo systemctl mask nginx` puede no funcionar si hay otros servicios que lo relanzan. La solución es simplemente usar otro puerto.

---

### Problema: Login da error `Http failure during parsing` (status 200)

**Síntoma:** En la consola del navegador aparece:
```
HTTP Error: 200 Http failure during parsing for .../api/registrador/login
```

**Causa:** El backend devuelve el JWT como `text/plain` (Spring Boot serializa `ResponseEntity<String>` sin encabezado `Content-Type: application/json`). Angular por defecto intenta parsear JSON y falla.

**Solución:** El archivo `auth-state.service.ts` debe tener `responseType: 'text'` en los 3 métodos de login. Verificar que el archivo copiado con `scp` lo tiene:

```typescript
// Correcto:
this.http.post(`${this.apiUrl}/registrador/login`, { usuario, password }, { responseType: 'text' })

// Incorrecto (da el error):
this.http.post<string>(`${this.apiUrl}/registrador/login`, { usuario, password })
```

---

### Problema: Login no redirige / JWT no se adjunta a peticiones (401 en todo)

**Síntoma:** El login devuelve 200 y el token se guarda en localStorage, pero todas las peticiones posteriores retornan 401.

**Causa:** El interceptor `auth.interceptor.ts` existe pero está registrado como interceptor basado en clase (`HTTP_INTERCEPTORS`). En Angular 17+, estos interceptores son ignorados silenciosamente si `provideHttpClient()` no incluye `withInterceptorsFromDi()`.

**Solución:** El archivo `app.config.ts` debe tener:

```typescript
import { provideHttpClient, withFetch, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
// ...
provideHttpClient(withFetch(), withInterceptorsFromDi()),
```

Verificar que el archivo copiado con `scp` lo tiene antes de reconstruir.

---

### Problema: Error CORS en el navegador

**Síntoma:** En la consola del navegador: `Access to XMLHttpRequest at '...' from origin 'https://xxxx.trycloudflare.com' has been blocked by CORS policy`.

**Causa:** La URL de Cloudflare no está en `CORS_ALLOWED_ORIGINS` del backend. Esto pasa siempre que el contenedor `vote4tech-cloudflared` se reinicia, porque la URL cambia.

**Solución:**

1. Obtener la nueva URL: `docker logs vote4tech-cloudflared 2>&1 | grep trycloudflare`
2. Actualizar `CORS_ALLOWED_ORIGINS` en `Vote4TechRegistraduriaBack/docker/docker-compose.prod.yml`
3. Subir el archivo al VM de backends con `scp`
4. En el VM de backends: `docker compose -f docker/docker-compose.prod.yml up -d`

---

### Problema: Los dos frontends tienen el mismo nombre de proyecto Docker

**Síntoma:** Al levantar VotacionFront después de RegistraduriaFront (o viceversa), Docker dice que los contenedores ya existen y los nombres colisionan.

**Causa:** Si `docker-compose.prod.yml` no tiene la clave `name:` al inicio, Docker usa el nombre de la carpeta como nombre del proyecto, y si ambos frontends tienen la misma carpeta padre el nombre puede colisionar.

**Solución:** Ambos archivos `docker-compose.prod.yml` ya tienen la clave `name:` definida:
- RegistraduriaFront: `name: vote4tech-registraduria`
- VotacionFront: `name: vote4tech-votacion`

No eliminar esa línea.

---

### Problema: Contenedor levanta pero la app muestra pantalla en blanco

**Síntoma:** La URL de Cloudflare abre pero muestra pantalla en blanco o error 404.

**Diagnóstico:**

```bash
docker logs vote4tech-front --tail=50
```

Si hay errores de nginx (`upstream connect error`), el backend no está respondiendo. Verificar desde el VM de frontends:

```bash
curl http://10.43.100.131:8080/eleccion/elecciones
```

Si no responde, revisar el estado del backend en `10.43.100.131`.

---

### Problema: `docker compose` dice que no hay cambios y no reconstruye

**Causa:** Docker compara hashes de capas de imagen. Si los archivos fuente cambiaron pero no el `Dockerfile`, a veces usa caché.

**Solución:** Forzar reconstrucción sin caché:

```bash
docker compose -f docker/docker-compose.prod.yml build --no-cache
docker compose -f docker/docker-compose.prod.yml up -d
```

---

## Comandos de Diagnóstico Rápido

```bash
# Ver todos los contenedores corriendo
docker ps

# Ver logs del frontend (últimas 50 líneas)
docker logs vote4tech-front --tail=50

# Ver logs en tiempo real
docker logs -f vote4tech-front

# Ver la URL de Cloudflare actual
docker logs vote4tech-cloudflared 2>&1 | grep trycloudflare

# Verificar que el backend responde desde el VM de frontends
curl http://10.43.100.131:8080/eleccion/elecciones

# Verificar que el proxy nginx del frontend funciona
curl http://localhost:8090/api/eleccion/elecciones

# Reiniciar solo el cloudflared (genera nueva URL)
docker restart vote4tech-cloudflared

# Bajar todo y volver a levantar
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

---

## Cómo Funciona el Build Docker (multi-stage)

El `Dockerfile` tiene **2 etapas**. Entenderlas explica por qué el primer build es lento y los siguientes más rápidos, y por qué a veces los cambios no se reflejan.

```
┌─────────────────────────────────────────────────────────┐
│  ETAPA 1: builder  (imagen node:22-alpine)              │
│                                                         │
│  1. COPY package.json package-lock.json  ← cacheado     │
│  2. RUN npm ci --prefer-offline          ← cacheado si  │
│                                            package.json  │
│                                            no cambió     │
│  3. COPY . .          ← copia el código fuente          │
│  4. RUN npm run build ← compila Angular en modo prod    │
│                                                         │
│  Resultado: /app/dist/portal-privado/browser/           │
└──────────────────────┬──────────────────────────────────┘
                       │ solo se copian los archivos
                       │ compilados (HTML/JS/CSS)
┌──────────────────────▼──────────────────────────────────┐
│  ETAPA 2: production  (imagen nginx:alpine)             │
│                                                         │
│  1. COPY dist/...   → /usr/share/nginx/html/            │
│  2. COPY nginx.conf → /etc/nginx/conf.d/default.conf    │
│  3. EXPOSE 80                                           │
│  4. CMD nginx -g "daemon off;"                          │
│                                                         │
│  Imagen final: ~50 MB (solo nginx + HTML/JS/CSS)        │
│  La imagen de build (node + node_modules) se descarta   │
└─────────────────────────────────────────────────────────┘
```

**¿Por qué el primer build tarda tanto?**
- Docker descarga `node:22-alpine` (~180 MB) y `nginx:alpine` (~50 MB)
- `npm ci` instala todas las dependencias de `node_modules` (~300 MB)
- Angular compila el proyecto completo

**¿Por qué los builds siguientes son más rápidos?**
- Docker cachea las capas. Si `package.json` no cambió, reutiliza el `npm ci` cacheado
- Solo recompila desde `COPY . .` en adelante

**¿Cuándo Docker ignora el caché y hay que usar `--no-cache`?**
- Cuando hay cambios que Docker no detecta (cambio de archivo de fix copiado con `scp`)
- Cuando el caché está corrupto
- Cuando se necesita asegurar que las dependencias npm estén actualizadas

---

## Cómo Funciona nginx como API Gateway

El nginx dentro del contenedor hace **dos cosas**:

```
┌─────────────────────────────────────────────────────────────┐
│              nginx (dentro del contenedor)                  │
│                                                             │
│  Puerto 80 → expuesto como 8090 en el host                  │
│                                                             │
│  Petición GET /api/candidato/candidatos                     │
│      ↓                                                      │
│  location /api/ → proxy_pass http://10.43.100.131:8080/    │
│      ↓  (elimina el prefijo /api/)                          │
│  Backend recibe: GET /candidato/candidatos                  │
│                                                             │
│  Petición GET /dashboard (o cualquier ruta Angular)         │
│      ↓                                                      │
│  location / → try_files $uri /index.html                    │
│      ↓                                                      │
│  Devuelve index.html → Angular maneja el routing            │
└─────────────────────────────────────────────────────────────┘
```

**Implicaciones importantes:**

1. **El `apiUrl` en Angular es `/api`** (relativo), no `http://10.43.100.131:8080`. Las llamadas van a nginx primero, que las reenvía al backend.

2. **CORS dentro del contenedor no aplica** — el navegador hace peticiones a `/api/...` en el mismo origen (nginx), y nginx las reenvía al backend con `proxy_set_header Origin ""`. El backend no ve el origen del navegador.

3. **CORS sí aplica cuando la URL cambia** — si el frontend está en `https://xxxx.trycloudflare.com`, el navegador sigue haciendo peticiones al mismo dominio (`/api/...`), así que CORS no debería ser un problema para las peticiones Angular→nginx→backend. Sin embargo, si hay algún endpoint al que se llama directamente al backend (hardcoded), eso sí genera CORS.

4. **Si nginx.conf tiene la IP del backend incorrecta**, todas las peticiones API devuelven 502. Ver `docker/nginx.conf` y verificar que `proxy_pass` apunta a `http://10.43.100.131:8080/`.

---

## Gestión de Imágenes Docker

Cada `--build` crea o actualiza una imagen local. Con el tiempo se acumulan imágenes "dangling" (capas intermedias sin etiqueta) que consumen espacio en disco.

```bash
# Ver todas las imágenes locales (incluye tamaños)
docker images

# Ver solo las imágenes de este proyecto
docker images | grep vote4tech

# Eliminar imágenes sin usar (dangling)
docker image prune

# Limpieza completa: imágenes sin usar + contenedores parados + redes huérfanas
docker system prune

# Ver cuánto espacio usa Docker en total
docker system df
```

> **Precaución con `docker system prune -a`:** elimina TODAS las imágenes no usadas por ningún contenedor activo, incluyendo la imagen cacheada del build. El siguiente `--build` descargará todo desde cero.

Flujo habitual cuando el VM se queda sin espacio en disco:

```bash
# 1. Verificar espacio disponible
df -h

# 2. Ver qué ocupa Docker
docker system df

# 3. Limpiar solo imágenes intermedias (seguro)
docker image prune -f

# 4. Si el VM sigue sin espacio, eliminar imágenes viejas del proyecto
docker images | grep vote4tech
docker rmi vote4tech-front:latest  # solo si el contenedor no está corriendo
```

---

## Ambiente QA

El ambiente QA usa VMs distintas. Los pasos son idénticos cambiando solo las IPs:

| Servicio               | VM Producción    | VM QA          |
|------------------------|------------------|----------------|
| RegistraduriaFront     | `10.43.97.237`   | `10.43.97.232` |
| RegistraduriaBack      | `10.43.100.131`  | `10.43.99.3`   |
| PostgreSQL             | `10.43.101.13`   | `10.43.98.254` |

En `docker/nginx.conf` de RegistraduriaFront QA, cambiar el `proxy_pass`:

```nginx
# Producción:
proxy_pass http://10.43.100.131:8080/;
# QA:
proxy_pass http://10.43.99.3:8080/;
```

En `docker-compose.prod.yml` de RegistraduriaBack QA, `CORS_ALLOWED_ORIGINS` debe incluir `http://10.43.97.232:8090` y la URL de Cloudflare QA.
