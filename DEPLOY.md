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
