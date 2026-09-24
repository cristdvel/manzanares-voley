# Despliegue — Cloudflare Pages + dominio en Namecheap

> Reparto: **tú** creas la cuenta de Cloudflare, conectas el repo y aplicas los
> registros DNS en Namecheap. **Claude** deja el repo listo, hace push y verifica
> el resultado. Claude no entra a Namecheap ni a Cloudflare.

---

## 1. Repositorio en GitHub

`gh` no está instalado en esta máquina. Elige una:

**A) Instalar `gh` (una vez):**

```bash
winget install --id GitHub.cli -e
gh auth login        # elige GitHub.com → HTTPS → autenticar por navegador
```

Luego Claude ejecuta:

```bash
gh repo create manzanares-voley --public --source . --remote origin --push
```

**B) Sin `gh`:** crea el repo vacío en <https://github.com/new> (nombre
`manzanares-voley`, sin README ni .gitignore) y pásale la URL a Claude, que hará:

```bash
git remote add origin https://github.com/<usuario>/manzanares-voley.git
git push -u origin main
```

---

## 2. Proyecto en Cloudflare Pages

1. Entra en <https://dash.cloudflare.com> → **Workers & Pages** → **Create** →
   pestaña **Pages** → **Connect to Git**.
2. Autoriza GitHub y selecciona el repo `manzanares-voley`.
3. Configuración del build:

   | Campo                     | Valor           |
   | :------------------------ | :-------------- |
   | Framework preset          | `Astro`         |
   | Build command             | `npm run build` |
   | Build output directory    | `dist`          |
   | Production branch          | `main`          |

4. En **Environment variables** (Production y Preview) añade:

   | Nombre         | Valor |
   | :------------- | :---- |
   | `NODE_VERSION` | `22`  |

5. **Save and Deploy**. En 1–2 min tendrás una URL `https://manzanares-voley.pages.dev`.
   Cada `push` a `main` vuelve a desplegar solo.

---

## 3. Dominio de Namecheap

> ⚠️ **Antes de tocar nada**: si el dominio tiene **email** (registros `MX`) o
> cualquier servicio en uso, apúntalos primero. Los pasos de abajo no deben
> borrar esos registros.

Hay dos formas. La **opción A es la recomendada**.

### Opción A — Mover los nameservers a Cloudflare (recomendada)

Ventajas: DNS gestionado desde Cloudflare, apex sin líos (CNAME flattening),
caché, analítica y HTTPS sin configurar nada más.

1. En Cloudflare: **Add a site** → escribe `manzanaresvoley.com` → plan **Free**.
2. Cloudflare escanea los registros actuales. **Revisa que aparezcan los `MX` y
   cualquier `TXT`** (SPF, verificaciones). Si falta alguno, añádelo a mano ahora.
3. Cloudflare te da **2 nameservers** (p. ej. `xxx.ns.cloudflare.com`).
4. En **Namecheap** → *Domain List* → *Manage* → sección **Nameservers** →
   elige **Custom DNS** → pega los 2 de Cloudflare → guarda (✓).
5. La propagación tarda de minutos a 24 h. Cloudflare te avisa por email cuando
   el dominio está activo.
6. Vuelve al proyecto de **Pages** → pestaña **Custom domains** → **Set up a
   domain** → `manzanaresvoley.com` y otra vez con `www.manzanaresvoley.com`.
   Como el DNS ya está en Cloudflare, crea los registros automáticamente.

### Opción B — Dejar el DNS en Namecheap

En **Namecheap** → *Manage* → **Advanced DNS** → *Host Records*:

| Type          | Host  | Value                          | TTL       |
| :------------ | :---- | :----------------------------- | :-------- |
| CNAME Record  | `www` | `manzanares-voley.pages.dev`   | Automatic |
| ALIAS Record  | `@`   | `manzanares-voley.pages.dev`   | Automatic |

- Borra el registro `CNAME`/`URL Redirect` de `www` que Namecheap trae por
  defecto (el "parking page"), y el `A` record `@` que apunta a `parkingpage`.
- **No toques** los registros `MX` ni los `TXT` de email.
- Luego, en **Pages → Custom domains**, añade `manzanaresvoley.com` y
  `www.manzanaresvoley.com`. Cloudflare valida el CNAME y emite el certificado.

> Nota: si Namecheap no ofusca el tipo **ALIAS Record**, usa `CNAME` en `www` y
> configura el apex con un **URL Redirect Record** de `@` a
> `https://www.manzanaresvoley.com`.

---

## 4. Verificación (Claude)

Cuando el dominio resuelva, Claude comprueba:

- `https://manzanaresvoley.com` carga el sitio y fuerza HTTPS
- `www` redirige al dominio principal (o viceversa, según se elija)
- Sin errores en consola
- Cabeceras de `public/_headers` presentes en la respuesta

---

## Ajustes en el repo cuando el dominio esté fijado

- `astro.config.mjs` → `site: 'https://<dominio-final>'`
- `public/robots.txt` y `public/_redirects` → mismo dominio
- `src/data/site.ts` → `url`, `email`

---

## 5. Pedidos de la tienda (email con Resend)

El formulario de `/tienda` envía cada pedido + el comprobante adjunto por email
mediante la función `functions/api/pedido.ts` (Cloudflare Pages Functions) y
**Resend**. Sin configurar la clave, el formulario devuelve un error controlado.

1. Crea una cuenta en <https://resend.com> (plan gratuito: 3.000 emails/mes).
2. **API Keys** → *Create API Key* (permiso *Sending access*). Copia la clave `re_...`.
3. En Cloudflare → proyecto Pages → **Settings → Environment variables**
   (entorno *Production* y *Preview*):

   | Nombre           | Valor                                             |
   | :--------------- | :------------------------------------------------ |
   | `RESEND_API_KEY` | la clave `re_...`                                 |
   | `PEDIDOS_TO`     | `manzanaresvoley@gmail.com` (opcional, es el valor por defecto) |
   | `PEDIDOS_FROM`   | `Tienda Manzanares Voley <pedidos@manzanaresvoley.com>` (opcional) |

4. **Remitente:**
   - Rápido: deja `PEDIDOS_FROM` sin poner → usa `onboarding@resend.dev`
     (funciona ya, pero puede caer en spam).
   - Recomendado: en Resend → **Domains** → añade `manzanaresvoley.com` y crea
     los registros DNS que te da (SPF/DKIM) en Cloudflare. Luego pon
     `PEDIDOS_FROM` con una dirección `@manzanaresvoley.com`.
5. Vuelve a desplegar (cualquier push) para que la función coja las variables.
6. Prueba: haz un pedido en `/tienda` con un archivo pequeño y confirma que
   llega el email.

> Límite del adjunto: 8 MB (imagen o PDF). Se puede subir en `functions/api/pedido.ts`.

---

## 6. Registro de pedidos en Google Sheets (el "Excel" descargable)

Además del email, cada pedido se guarda como una fila en una hoja de Google
Sheets: fecha, cliente, equipo, producto, variante y la talla de cada prenda
en su propia columna (Camiseta de juego, Camiseta de entreno, Malla, etc. —
en blanco las que no aplican a ese pedido), cantidad, comprobante (enlace a
Drive) y dos columnas libres — **Estado** y **Comentario interno** — para que
el club anote cómo va cada pedido. Es opcional: sin configurar esto, la
tienda sigue funcionando igual (solo por email).

1. Crea una hoja de cálculo nueva en <https://sheets.new> y llámala p. ej.
   **"Pedidos tienda Manzanares"**.
2. Menú **Extensiones → Apps Script**. Borra el código de ejemplo y pega el
   contenido de [`scripts/apps-script-pedidos.gs`](scripts/apps-script-pedidos.gs)
   de este repo. Guarda (icono de disquete).
3. **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo** (tu cuenta de Google).
   - Quién tiene acceso: **Cualquier usuario**.
   - *Implementar* → la primera vez pide autorizar permisos (Sheets + Drive):
     acepta con la misma cuenta de Google.
4. Copia la **URL de la aplicación web** que te da (termina en `/exec`).
5. En Cloudflare → proyecto Pages → **Settings → Environment variables**,
   añade `SHEETS_WEBHOOK_URL` con esa URL (entornos *Production* y *Preview*).
6. Vuelve a desplegar (cualquier push) y haz un pedido de prueba en `/tienda`:
   debería aparecer una fila nueva en una **pestaña llamada "Pedidos"** (el
   script la crea la primera vez, es una pestaña nueva al lado de "Hoja 1" —
   mira abajo del todo de la hoja de cálculo si no la ves a primera vista),
   con el comprobante subido a una carpeta de Drive llamada "Comprobantes
   Tienda Manzanares" con el nº de pedido como nombre de archivo.
7. **Panel de pedidos:** la propia hoja de cálculo hace de panel — filtra,
   ordena, escribe en "Estado"/"Comentario interno", o **Archivo → Descargar →
   Microsoft Excel (.xlsx)** cuando quieras el Excel offline.

> Si más adelante cambias el código del Apps Script, tienes que volver a
> **Implementar → Gestionar implementaciones → editar (lápiz) → Nueva versión**
> para que el cambio se publique (guardar el archivo no es suficiente).

> El registro en Sheets se hace en segundo plano (no bloquea la respuesta al
> cliente): un pedido puede aparecer en la hoja unos segundos después de que
> el comprador vea la página de confirmación. Si nunca aparece, revisa en
> Apps Script → **Ejecuciones** (icono de reloj a la izquierda) los últimos
> intentos y su error.

---

## 7. Notificaciones push de partidos (PWA)

El sitio ya es una PWA instalable con caché offline (manifest, iconos y
`public/sw.js` — no requiere configuración). Esta sección es solo para
activar el botón **"🔔 Avisos de partidos"**, que manda una notificación
push el día antes de cada partido federado. Es opcional: sin esto, la PWA
se instala y funciona offline igual, simplemente no aparece el botón.

Hacen falta tres cosas en Cloudflare y varios secretos en GitHub.

### 7.1. Espacio de almacenamiento (KV) para las suscripciones

1. Cloudflare → **Workers & Pages → KV** (menú lateral) → **Create a namespace**.
   Nómbralo p. ej. `manzanares-push-subs`.
2. Copia el **Namespace ID** que te da (lo necesitas en el paso 7.3).
3. Ve a tu proyecto Pages → **Settings → Functions → KV namespace bindings**
   → **Add binding**:
   - Variable name: `PUSH_SUBS`
   - KV namespace: el que acabas de crear.
4. Vuelve a desplegar (cualquier push) para que el binding esté activo.

### 7.2. Clave pública en el build de Cloudflare Pages

En **Settings → Environment variables** del proyecto Pages, añade (entornos
*Production* y *Preview*):

```
PUBLIC_VAPID_PUBLIC_KEY = BBxOtlOkj2LXlx4wUq1weA_86z362zkl0yptzd2_6ybdDDCJ7P9cG0BQ4Cer2AYJqsS2ZuyvGmT6vgbMVgzJTFY
```

> Esta es la clave **pública** generada para este proyecto — no es secreta,
> va incrustada en el JavaScript del navegador. La clave **privada** (abajo)
> nunca va en Cloudflare Pages, solo en los secretos de GitHub.

Vuelve a desplegar para que el botón "Avisos de partidos" aparezca en la web.

### 7.3. Secretos en GitHub (para el envío)

El envío lo hace la GitHub Action `.github/workflows/match-reminders.yml`
(cada 12 h) ejecutando `scripts/send-match-reminders.mjs`, que lee el
calendario ya descargado y manda los avisos por la API de Web Push. En
GitHub → **Settings → Secrets and variables → Actions → New repository
secret**, añade:

| Secreto | Valor |
| :-- | :-- |
| `VAPID_PUBLIC_KEY` | `BBxOtlOkj2LXlx4wUq1weA_86z362zkl0yptzd2_6ybdDDCJ7P9cG0BQ4Cer2AYJqsS2ZuyvGmT6vgbMVgzJTFY` |
| `VAPID_PRIVATE_KEY` | `n9LLESWeWQq-3C6pxC2hpv63gEBBS9PrLf7aLMm3usU` |
| `VAPID_SUBJECT` | `mailto:manzanaresvoley@gmail.com` |
| `CF_ACCOUNT_ID` | El ID de cuenta de Cloudflare (barra lateral derecha de cualquier página del dashboard) |
| `CF_KV_NAMESPACE_ID` | El Namespace ID del paso 7.1 |
| `CF_API_TOKEN` | Un token de API — créalo en **Mi perfil → API Tokens → Create Token → Edit Cloudflare Workers** (o un token personalizado con permiso *Workers KV Storage: Edit*) |

> Guarda `VAPID_PRIVATE_KEY` en un sitio seguro (gestor de contraseñas):
> quien la tenga puede mandar notificaciones a nombre del club. Si se
> filtrara, genera un par de claves nuevo (`npx web-push generate-vapid-keys`)
> y actualiza los tres sitios donde aparece (GitHub, Cloudflare Pages, y
> vuelve a desplegar).

### 7.4. Probarlo

1. Con todo lo anterior desplegado, entra a la web desde un navegador que
   soporte notificaciones (Chrome/Edge en Android o escritorio; en iPhone
   hace falta tener la PWA **instalada** primero — Safari no ofrece push a
   pestañas sueltas).
2. Pulsa **"🔔 Avisos de partidos"** en "Próximos partidos": se abre un
   panel para elegir "Todos los equipos" o marcar solo los equipos
   concretos de los que se quiere aviso (la lista sale de
   `equipos-federados.json`). Al pulsar "Guardar avisos" pide el permiso de
   notificaciones si hace falta y guarda la elección junto a la suscripción
   en el KV. Se puede reabrir el panel en cualquier momento (el botón pasa a
   decir "🔔 Avisos activados · editar") para cambiar los equipos elegidos o
   pulsar "🔕 Quitar todos los avisos".
3. En GitHub → pestaña **Actions** → "Avisos de partidos (push)" →
   **Run workflow** para lanzarlo a mano sin esperar al cron, y revisa el
   log: dice cuántos partidos había en la ventana de 12-36 h y a cuántas
   suscripciones se ha mandado el aviso.

> Solo avisa de partidos **federados** (los que tienen fecha y hora real de
> la Federación en `/calendario`). Los amistosos no tienen hora exacta
> verificable automáticamente, así que de momento no generan avisos push.

---

## 8. Analítica (Google Tag Manager + GA4 + Consent Mode v2)

El lado del código ya está listo: Consent Mode v2 por defecto (denegado
hasta que el visitante acepte en el banner de cookies), el snippet de GTM
(solo se activa si hay contenedor configurado) y tres eventos ya
instrumentados en `dataLayer` para lo que no se puede medir solo con GTM
(cambios de selector y envíos de formulario propios, sin recarga de
página):

| Evento (`dataLayer`) | Cuándo se dispara | Parámetros |
| :-- | :-- | :-- |
| `seleccion_equipo` | Al elegir un equipo en el desplegable de Calendario/Resultados/Clasificación | `categoria` (texto del equipo elegido) |
| `solicitud_inscripcion` | Al validar y enviar el formulario de inscripción (home, `#inscripciones`) | — |
| `pedido_realizado` | Al confirmarse un pedido en la tienda (antes de redirigir a `/tienda/gracias`) | `numero_pedido`, `producto`, `valor` (precio × cantidad) |

Todo lo de abajo se hace en las webs de Google, sin tocar este repo salvo
el paso 8.2 (variable de entorno en Cloudflare).

### 8.1. Crear la propiedad de GA4

1. Entra a <https://analytics.google.com> con la cuenta de Google del club
   (`manzanaresvoley@gmail.com`).
2. Icono de engranaje "Administrar" (abajo a la izquierda) → columna
   **Cuenta** → "Crear cuenta" → nombre "Club Voleibol Manzanares" →
   siguiente → siguiente → Crear (acepta el acuerdo de tratamiento de datos).
3. Columna **Propiedad** → "Crear propiedad" → nombre "Manzanares Voley —
   Web", zona horaria "España", moneda "Euro (EUR)" → Siguiente.
4. Datos del negocio: tamaño y sector "Deportes" → Crear → acepta los
   términos de GA4.
5. "Empezar a recopilar datos" → elige **Web**.
6. Configurar flujo de datos: URL `https://manzanaresvoley.com`, nombre del
   flujo "Web principal" → Crear flujo.
7. Te muestra un **ID de medición** con forma `G-XXXXXXXXXX` — apúntalo,
   se usa dentro de GTM en el paso 8.5 (no hace falta pegar ningún código
   en la web).

### 8.2. Crear el contenedor de GTM y activarlo en Cloudflare

1. Entra a <https://tagmanager.google.com> → "Crear cuenta".
2. Nombre de cuenta: "Club Voleibol Manzanares". País: España.
3. Nombre del contenedor: "manzanaresvoley.com". Plataforma de destino:
   **Web** → Crear → acepta los términos.
4. Te da un **ID de contenedor** con forma `GTM-XXXXXXX` — apúntalo. No
   pegues el snippet de instalación a mano: el sitio ya lo carga solo en
   cuanto configures la variable de entorno.
5. En Cloudflare → tu proyecto Pages → **Settings → Environment variables**
   (entornos *Production* y *Preview*), añade:

   ```
   PUBLIC_GTM_ID = GTM-XXXXXXX
   ```

   Vuelve a desplegar (cualquier push). Sin esta variable, el sitio no
   carga ningún script de Google — sigue funcionando igual que ahora.

### 8.3. Activar el soporte de Consent Mode en el contenedor

Dentro del contenedor GTM → icono de engranaje **Admin** → columna
Contenedor → **Configuración del contenedor** → marca **"Habilitar
información general sobre el consentimiento" (Enable consent overview)** →
Guardar. Con esto activado, GTM detecta solo las señales de consentimiento
que el sitio ya manda con `gtag('consent', …)` antes de cargar GTM, y no
disparará las tags de analítica hasta que `analytics_storage` esté
`granted` (es decir, hasta que la persona acepte el banner de cookies).

### 8.4. Variables de capa de datos (para leer los parámetros de los eventos)

Espacio de trabajo → **Variables** → pestaña "Variables definidas por el
usuario" → "Nueva" → tipo **Variable de capa de datos**. Crea estas
cuatro (nombre de variable = nombre exacto en `dataLayer`):

| Nombre de la variable en GTM | Nombre de variable de capa de datos |
| :-- | :-- |
| DLV - categoria | `categoria` |
| DLV - numero_pedido | `numero_pedido` |
| DLV - producto | `producto` |
| DLV - valor | `valor` |

### 8.5. Activadores (uno por evento personalizado)

**Activadores** → "Nuevo" → tipo **Evento personalizado**. Crea tres,
con el nombre de evento exactamente igual (sin comodines):

- `EP - seleccion_equipo` → nombre de evento: `seleccion_equipo`
- `EP - solicitud_inscripcion` → nombre de evento: `solicitud_inscripcion`
- `EP - pedido_realizado` → nombre de evento: `pedido_realizado`

### 8.6. Etiqueta de configuración de GA4

**Etiquetas** → "Nueva" → tipo **Google Analytics: Configuración de GA4**
(en contenedores nuevos puede llamarse "Etiqueta de Google"):

- ID de medición: pega el `G-XXXXXXXXXX` del paso 8.1.
- Activador: **All Pages** (Todas las páginas).
- Nombre de la etiqueta: `GA4 - Configuración` → Guardar.

### 8.7. Etiquetas de evento (una por cada evento de la tabla)

Para cada una: **Etiquetas** → "Nueva" → tipo **Google Analytics: Evento
de GA4** → en "Etiqueta de configuración" selecciona `GA4 - Configuración`
(la del paso anterior).

**a) Selección de equipo**
- Nombre del evento: `seleccion_equipo`
- Parámetros del evento: `categoria` = `{{DLV - categoria}}`
- Activador: `EP - seleccion_equipo`
- Nombre de la etiqueta: `GA4 - Selección de equipo`

**b) Solicitud de inscripción**
- Nombre del evento: `solicitud_inscripcion`
- Sin parámetros adicionales
- Activador: `EP - solicitud_inscripcion`
- Nombre de la etiqueta: `GA4 - Solicitud de inscripción`

**c) Pedido realizado**
- Nombre del evento: `pedido_realizado`
- Parámetros del evento: `numero_pedido` = `{{DLV - numero_pedido}}`,
  `producto` = `{{DLV - producto}}`, `valor` = `{{DLV - valor}}`
- Activador: `EP - pedido_realizado`
- Nombre de la etiqueta: `GA4 - Pedido realizado`

### 8.8. Probarlo con la Vista previa

1. GTM → botón **Vista previa** (Preview, arriba a la derecha) → pega la
   URL del sitio → Connect. Se abre el sitio con Tag Assistant conectado
   en otra pestaña.
2. Acepta el banner de cookies: en Tag Assistant debe verse un evento
   `consent` con las cuatro señales en `granted` (antes de aceptar deben
   salir en `denied`), y justo después debe dispararse `GA4 -
   Configuración`.
3. Cambia de equipo en el selector de `/calendario`: debe verse el evento
   `seleccion_equipo` y disparar la etiqueta `GA4 - Selección de equipo`
   con el parámetro `categoria` correcto.
4. Envía el formulario de inscripción de prueba: debe verse
   `solicitud_inscripcion` disparando su etiqueta.
5. Haz un pedido de prueba en la tienda: debe verse `pedido_realizado`
   disparando su etiqueta con los 3 parámetros rellenos.
6. En GA4 → **Informes → Tiempo real** (o **Configurar → DebugView** con
   el modo de depuración activado en Tag Assistant) deberían aparecer las
   sesiones y los 3 eventos en cuanto se disparen sus etiquetas.

### 8.9. Marcar los eventos clave (conversiones) en GA4

Una vez lleguen datos reales: GA4 → Admin → columna Propiedad → **Eventos**
→ busca `solicitud_inscripcion` y `pedido_realizado` → activa el interruptor
**"Marcar como evento clave"** en ambos. Así aparecen como conversiones en
los informes.

### 8.10. Publicar el contenedor

GTM → botón **Enviar** (Submit, arriba a la derecha) → nombre de versión
p. ej. "Config inicial GA4 + eventos" → **Publicar**. Hasta este paso todo
lo anterior solo se ve en modo Vista previa — nadie más recibe datos.

---

## 9. Formulario de inscripción (email + Excel)

El formulario de inscripción de la home (`#inscripciones`) funciona igual
que los pedidos de la tienda: al enviarse, manda un email al club y guarda
una fila en Google Sheets — reutiliza **las mismas** variables de entorno
de Cloudflare que ya tienes configuradas para los pedidos
(`RESEND_API_KEY`, `PEDIDOS_TO`, `PEDIDOS_FROM`, `SHEETS_WEBHOOK_URL`), así
que **no hay nada nuevo que configurar en Cloudflare**.

Lo único pendiente es actualizar el Apps Script de tu Google Sheet, porque
ahora también sabe registrar inscripciones en una pestaña nueva
**"Inscripciones"** (separada de "Pedidos"):

1. Abre tu hoja de cálculo → **Extensiones → Apps Script**.
2. Borra el código actual y pega el contenido actualizado de
   [`scripts/apps-script-pedidos.gs`](scripts/apps-script-pedidos.gs).
3. **Implementar → Gestionar implementaciones → editar (lápiz) → Nueva
   versión** (guardar el archivo no es suficiente, hay que publicar la
   nueva versión para que el cambio llegue a la web).
4. Haz una inscripción de prueba desde la home: debería llegarte el email
   a `manzanaresvoley@gmail.com` (o al `PEDIDOS_TO` que tengas configurado)
   y aparecer una fila nueva en la pestaña **"Inscripciones"** de la hoja
   (se crea sola la primera vez, igual que pasó con "Pedidos").

> La pestaña "Inscripciones" guarda: fecha, nombre del jugador/a, fecha de
> nacimiento, categoría orientativa (calculada automáticamente por edad),
> nombre del tutor, teléfono, email, experiencia previa y si autoriza el
> uso de imágenes — más las dos columnas libres "Estado" y "Comentario
> interno" para que el club apunte cómo va cada solicitud, igual que en
> "Pedidos".
