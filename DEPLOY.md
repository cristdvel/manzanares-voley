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
2. Pulsa **"🔔 Avisos de partidos"** en "Próximos partidos" y acepta el
   permiso de notificaciones.
3. En GitHub → pestaña **Actions** → "Avisos de partidos (push)" →
   **Run workflow** para lanzarlo a mano sin esperar al cron, y revisa el
   log: dice cuántos partidos había en la ventana de 12-36 h y a cuántas
   suscripciones se ha mandado el aviso.

> Solo avisa de partidos **federados** (los que tienen fecha y hora real de
> la Federación en `/calendario`). Los amistosos no tienen hora exacta
> verificable automáticamente, así que de momento no generan avisos push.
