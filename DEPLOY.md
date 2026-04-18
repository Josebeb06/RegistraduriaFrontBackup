# Guía de Despliegue — Vote4Tech Registraduría

## Infraestructura

| Componente   | VM / Host           | Puerto |
|--------------|---------------------|--------|
| Frontend     | `10.43.97.237`      | `80`   |
| Backend      | `10.43.100.131`     | `8080` |
| Base de datos| `10.43.101.13`      | `5432` |

El acceso externo se realiza mediante **Cloudflare Quick Tunnel** (URL temporal generada automáticamente en cada arranque).

---

## Acceso Remoto a las VMs

Se asume que Java, Maven y Docker ya están instalados en las VMs respectivas.

### Opción A — SSH (terminal)

Desde cualquier equipo en la red o con acceso a las VMs:

```bash
# Conectarse al VM del backend
ssh estudiante@10.43.100.131

# Conectarse al VM del frontend
ssh estudiante@10.43.97.237
```

Si pide contraseña, ingresar la del usuario `estudiante` en cada VM.

En Windows, abrir **PowerShell** o **CMD** y ejecutar el mismo comando `ssh` (viene instalado por defecto en Windows 10/11).

### Opción B — Escritorio Remoto (xrdp / RDP)

Las VMs tienen `xrdp` instalado y activo. Para acceder con interfaz gráfica:

1. En Windows: presionar `Win + R`, escribir `mstsc` y presionar Enter
2. En el campo **Equipo** ingresar la IP de la VM (`10.43.100.131` o `10.43.97.237`)
3. Hacer clic en **Conectar**
4. Ingresar usuario `estudiante` y la contraseña correspondiente
5. Una vez dentro, abrir una **Terminal** desde el escritorio o el menú de aplicaciones

> Desde la terminal del escritorio remoto se ejecutan exactamente los mismos comandos que se muestran en esta guía.

---

## Requisitos en cada VM

### VM Frontend (`10.43.97.237`)
- Docker y Docker Compose instalados
- Puerto 80 libre (el servicio `nginx` del sistema debe estar detenido)

### VM Backend (`10.43.100.131`)
- Java 21 instalado (`java -version`)
- Maven instalado (`mvn -version`)
- El servicio systemd `vote4tech-back.service` debe estar **detenido y deshabilitado**

---

## Paso 1 — Preparar el VM Backend (`10.43.100.131`)

Conectarse por SSH al VM del backend:

```bash
ssh estudiante@10.43.100.131
```

### 1.1 Detener el servicio systemd que ocupa el puerto 8080

Existe un servicio instalado en el sistema que arranca automáticamente un JAR anterior. Hay que detenerlo:

```bash
sudo systemctl stop vote4tech-back.service
sudo systemctl disable vote4tech-back.service
```

Verificar que el puerto 8080 quedó libre:

```bash
sudo ss -tlnp | grep 8080
```

No debe mostrar ningún resultado.

### 1.2 Editar `application.properties` con los valores correctos

```bash
nano ~/Vote4TechRegistraduriaBack/src/main/resources/application.properties
```

El archivo debe contener exactamente esto (reemplazar `<CLOUDFLARE_URL>` con el URL real obtenido en el Paso 3):

```properties
spring.application.name=PortalRegistraduriaBack
server.port=8080
spring.datasource.url=jdbc:postgresql://10.43.101.13:5432/bd_nacional_vote4tech
spring.datasource.username=admin_db_nacional
spring.datasource.password=12345
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
config.cors.allowed-origins=https://<CLOUDFLARE_URL>.trycloudflare.com,http://10.43.97.237
logging.level.org.springframework=INFO
```

> **Nota:** La primera vez se puede colocar un URL temporal en `allowed-origins`. Se actualiza después de obtener el URL real (Paso 3).

### 1.3 Arrancar el backend

```bash
cd ~/Vote4TechRegistraduriaBack
mvn spring-boot:run 2>&1 | tee /tmp/log.txt
```

Esperar hasta ver la línea:

```
Started PortalRegistraduriaBackApplication in X.X seconds
```

Dejar esta terminal abierta o usar `tmux` para que siga corriendo en segundo plano:

```bash
# Con tmux (recomendado):
tmux new -s backend
mvn spring-boot:run 2>&1 | tee /tmp/log.txt
# Para desconectarse sin matar el proceso: Ctrl+B, luego D
```

---

## Paso 2 — Desplegar el Frontend (`10.43.97.237`)

Conectarse por SSH al VM del frontend:

```bash
ssh estudiante@10.43.97.237
```

### 2.1 Detener el nginx del sistema (solo la primera vez)

```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
```

### 2.2 Subir el código (si no está ya en el VM)

**Opción A — Desde acceso remoto al VM (SSH o xrdp):**

Si el repositorio ya está en la VM o está disponible en git, clonarlo directamente desde la terminal del VM:

```bash
cd ~
git clone <URL_DEL_REPOSITORIO> Vote4TechRegistraduriaFront
```

Si ya existe la carpeta y solo se quieren traer los últimos cambios:

```bash
cd ~/Vote4TechRegistraduriaFront
git pull
```

**Opción B — Desde PowerShell local (Windows):**

Copiar el proyecto al VM excluyendo `node_modules`:

```powershell
robocopy "C:\ruta\al\Vote4TechRegistraduriaFront" "$env:TEMP\vote4tech-front-deploy" /E /XD node_modules .angular
scp -r "$env:TEMP\vote4tech-front-deploy" estudiante@10.43.97.237:~/Vote4TechRegistraduriaFront
```

### 2.3 Levantar los contenedores

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml up -d --build
```

Verificar que los contenedores están corriendo:

```bash
docker ps
```

Deben aparecer dos contenedores: `frontend` y `cloudflared`.

---

## Paso 3 — Obtener el URL de Cloudflare

En el VM del frontend, obtener el URL generado por el túnel:

```bash
docker logs $(docker ps -q --filter name=cloudflared) 2>&1 | grep trycloudflare
```

El URL tiene la forma `https://xxxx-xxxx-xxxx-xxxx.trycloudflare.com`.

### 3.1 Actualizar CORS en el backend

Si el URL de Cloudflare es diferente al que estaba en `application.properties`, actualizar en el VM del backend:

```bash
nano ~/Vote4TechRegistraduriaBack/src/main/resources/application.properties
```

Cambiar la línea `config.cors.allowed-origins` con el nuevo URL. Luego reiniciar el backend:

```bash
# Si está en tmux:
tmux attach -t backend
# Ctrl+C para detener, luego:
mvn spring-boot:run 2>&1 | tee /tmp/log.txt
```

---

## Paso 4 — Verificar el despliegue

### 4.1 Verificar que el API gateway responde (desde el VM del frontend)

```bash
curl http://localhost/api/eleccion/elecciones
```

Debe devolver un JSON con las elecciones. Si devuelve HTML de Angular, revisar `docker/nginx.conf`.

### 4.2 Verificar acceso externo

Abrir desde un navegador con datos móviles (fuera de la red universitaria):

```
https://xxxx-xxxx-xxxx-xxxx.trycloudflare.com
```

---

## Troubleshooting

### Puerto 8080 ocupado en el backend

```bash
sudo systemctl stop vote4tech-back.service
sudo systemctl disable vote4tech-back.service
sudo ss -tlnp | grep 8080
```

Si aún aparece un proceso Java:

```bash
sudo kill -9 $(sudo lsof -t -i:8080)
```

### El URL de Cloudflare cambió

El URL cambia cada vez que el contenedor `cloudflared` se reinicia. Solución:

1. Obtener el nuevo URL (ver Paso 3)
2. Actualizar `application.properties` en el backend
3. Reiniciar el backend

Para un URL permanente, crear una cuenta gratuita en [Cloudflare Zero Trust](https://one.dash.cloudflare.com) y configurar un Named Tunnel con dominio propio.

### Ver logs del frontend

```bash
docker logs $(docker ps -q --filter name=frontend) --tail=50
```

### Reiniciar solo el frontend sin reconstruir

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml restart frontend
```

### Reconstruir completamente

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

---

## Ambiente QA

El ambiente de QA usa máquinas distintas a producción. Los pasos son los mismos, pero con las siguientes IPs:

| Componente   | VM Producción       | VM QA               | Puerto |
|--------------|---------------------|---------------------|--------|
| Frontend     | `10.43.97.237`      | `10.43.97.232`      | `80`   |
| Backend      | `10.43.100.131`     | `10.43.99.3`        | `8080` |
| Base de datos| `10.43.101.13`      | `10.43.98.254`      | `5432` |

### Qué cambiar en el VM Backend QA (`10.43.99.3`)

Editar `application.properties` con las IPs de QA:

```bash
nano ~/Vote4TechRegistraduriaBack/src/main/resources/application.properties
```

```properties
spring.application.name=PortalRegistraduriaBack
server.port=8080
spring.datasource.url=jdbc:postgresql://10.43.98.254:5432/bd_nacional_vote4tech
spring.datasource.username=admin_db_nacional
spring.datasource.password=12345
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
config.cors.allowed-origins=https://<CLOUDFLARE_URL>.trycloudflare.com,http://10.43.97.232
logging.level.org.springframework=INFO
```

Diferencias respecto a producción:
- `spring.datasource.url` apunta a `10.43.98.254` en lugar de `10.43.101.13`
- `config.cors.allowed-origins` incluye `10.43.97.232` en lugar de `10.43.97.237`

Luego arrancar normalmente:

```bash
cd ~/Vote4TechRegistraduriaBack
mvn spring-boot:run 2>&1 | tee /tmp/log.txt
```

### Qué cambiar en el VM Frontend QA (`10.43.97.232`)

El `nginx.conf` tiene hardcodeada la IP del backend. Hay que editarlo antes de construir el contenedor:

```bash
nano ~/Vote4TechRegistraduriaFront/docker/nginx.conf
```

Cambiar la línea `proxy_pass` de:

```nginx
proxy_pass http://10.43.100.131:8080/;
```

a:

```nginx
proxy_pass http://10.43.99.3:8080/;
```

Guardar y luego levantar los contenedores:

```bash
cd ~/Vote4TechRegistraduriaFront
docker compose -f docker/docker-compose.prod.yml up -d --build
```

> El `--build` es obligatorio para que Nginx tome el nuevo `nginx.conf`.

Obtener el URL de Cloudflare:

```bash
docker logs $(docker ps -q --filter name=cloudflared) 2>&1 | grep trycloudflare
```

Actualizar ese URL en el `application.properties` del backend QA y reiniciar el backend.

### Verificar QA

Desde el VM frontend QA:

```bash
curl http://localhost/api/eleccion/elecciones
```

Debe devolver JSON. Si devuelve un error de conexión, verificar que el backend en `10.43.99.3:8080` está corriendo.
