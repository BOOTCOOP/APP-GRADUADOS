# Postulación a búsquedas laborales (PHP legacy)

La app postula **directo al mismo controller PHP que usa el formulario de
derecho.uba.ar**. No hay endpoint nuevo en la API Laravel.

```
POST {VITE_LEGACY_WEB_URL}/graduados/admin/php/controllers/postularBusqueda.controller.php
Content-Type: application/x-www-form-urlencoded
```

| campo               | valor                                                      |
| ------------------- | ---------------------------------------------------------- |
| `id_busqueda`       | id del job de la API de la app (es el mismo `busqueda_id`)  |
| `nombre`            | `user.firstname`                                           |
| `apellido`          | `user.lastname`                                             |
| `email`             | `user.email`                                                |
| `dni`               | `user.dni`                                                  |
| `verificacion`      | un número cualquiera                                        |
| `resultadoEsperado` | **el mismo número** que `verificacion`                      |

## Cuatro cosas que no son obvias

1. **Siempre responde HTTP 200.** El resultado viene en el **cuerpo** como texto
   plano: `success` si registró la postulación, o el motivo del error. El código
   de estado no sirve para nada — si te guiás por él, todo parece exitoso. La
   acción del store inspecciona el body y rechaza a mano.

2. **No usa la instancia de axios de la app.** `@/libs/axios` tiene `baseURL` de
   la API, inyecta el Bearer token en cada request (no queremos mandarlo a otro
   host) y su interceptor de 401 **cierra la sesión y redirige al login**: un 401
   del sitio legacy desloguearía al usuario. Se usa `axios` pelado con URL
   absoluta.

3. **CORS depende de CapacitorHttp.** Funciona en la app nativa porque
   `capacitor.config.ts` tiene `CapacitorHttp: { enabled: true }`, así que los
   fetch/XHR salen por código nativo, sin preflight ni política de origen. ⚠️ En
   el build **web** (GitHub Pages) el navegador lo va a bloquear salvo que el PHP
   devuelva `Access-Control-Allow-Origin`.

4. **El "captcha" es decorativo.** El formulario web genera una suma aleatoria y
   manda el resultado esperado en el mismo POST, así que no valida nada del lado
   del cliente. No se le pide a alguien que ya inició sesión: se mandan los dos
   campos iguales.

## Diferencia con la web: no se piden datos

La web pide nombre, apellido, email y DNI porque el visitante es anónimo. En la
app la persona ya inició sesión (de hecho, **con su DNI**), así que el modal es
una **confirmación**, no un formulario: muestra los datos de la cuenta para que
los revise —la postulación es una declaración jurada— y los manda.

Si a la cuenta le falta alguno de los cuatro campos, el modal avisa cuál y
bloquea el envío con un link a *Mi cuenta*, en vez de dejar que el PHP falle.

⚠️ **Dependencia a verificar**: `email` y `dni` se leen del usuario guardado en
localStorage. Si `GET /api/profile` no los devuelve en el `UserResource`, se ven
vacíos (es lo que pasa hoy en la pantalla *Mi cuenta*, donde son campos
readonly) y la postulación queda bloqueada. Cuando el modal detecta que faltan,
pide `/profile` para refrescar; si aun así no vienen, hay que agregarlos al
recurso del backend.

## Archivos

- `src/store/modules/resources/job/jobs.ts` → acción `apply` (**único lugar con
  la URL y el armado del payload**).
- `src/views/jobs/components/ApplyModal.vue` → modal de confirmación + éxito.
- `src/views/jobs/Show.vue` → botón "Postulate a esta búsqueda".
- `.env` → `VITE_LEGACY_WEB_URL` (`https://www.derecho.uba.ar` en producción,
  `https://testing.derecho.uba.ar` para probar).
