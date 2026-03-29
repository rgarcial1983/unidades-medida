# 📏⚖️🧴 Aprendo las Unidades de Medida

> Juego educativo e interactivo para aprender las unidades de longitud, masa y capacidad del Sistema Métrico Decimal de forma divertida.

---

## 🎯 ¿Qué es este proyecto?

Una aplicación web educativa diseñada especialmente para niños con necesidades especiales, con un diseño visual claro, animado y accesible. El juego plantea preguntas de opción múltiple sobre unidades de medida, ofrece feedback inmediato tras cada respuesta y permite repasar el contenido teórico en cualquier momento.

---

## 📁 Estructura de archivos

```
📂 proyecto/
├── index.html      → Estructura HTML de todas las pantallas
├── styles.css      → Estilos, animaciones y diseño responsive
├── app.js          → Lógica del juego (carga, barajado, puntuación…)
└── datos.json      → Banco de preguntas y contenido teórico (editable)
```

---

## 🎮 Pantallas del juego

### ⏳ Cargando
Pantalla de inicio animada mientras se carga el fichero `datos.json` mediante `fetch`.

### 👋 Bienvenida
- El niño introduce su nombre
- Elige el número de preguntas:
  - ⚡ **Rápido** — 5 preguntas
  - 🎯 **Normal** — 10 preguntas
  - 🏆 **Reto** — 20 preguntas (sin botón de repasar)
- Botón **🚀 ¡Empezar!** para iniciar la partida
- Botón **📖 Repasar el tema** para abrir el modal de repaso

### 🧠 Juego
- Cabecera con nombre del jugador, número de pregunta y puntos acumulados
- Barra de progreso animada
- Card central con emoji, pregunta y 4 opciones de respuesta
- Botón **✅ Confirmar** (se activa solo al seleccionar una opción)
- Botón **📖 Repasar** en la cabecera (visible solo en modos Rápido y Normal)

### 💬 Feedback (overlay)
Aparece tras confirmar cada respuesta:
- Emoji + título (¡Correcto! / ¡Casi!)
- Badge verde con la respuesta correcta
- Badge rojo con la respuesta elegida (si era incorrecta)
- Explicación didáctica y amigable
- Botón **Siguiente ➡️**

### 🏆 Resultados
Mascota y mensaje según el porcentaje obtenido:

| Porcentaje | Mascota | Mensaje |
|:---:|:---:|---|
| 100% | 🏆 | ¡Perfecto! ¡Eres increíble! |
| ≥ 90% | 🦸 | ¡Casi perfecto! ¡Súper! |
| ≥ 80% | 🌟 | ¡Muy bien hecho! |
| ≥ 60% | 😊 | ¡Buen trabajo! |
| ≥ 40% | 🐣 | ¡Sigue practicando! |
| < 40% | 🌱 | ¡Vamos a aprender más! |

Si se supera el **80%**, se lanza animación de 🎊 confeti.

---

## 📖 Modal "Repasar el tema"

Accesible desde la pantalla de bienvenida y desde el juego (solo modos Rápido y Normal).

Contiene tres secciones visuales con badges de colores:

- **📏 Longitud** — km, m, dm, cm, mm con equivalencias y ejemplos cotidianos
- **⚖️ Masa** — t, kg, g, mg con equivalencias y ejemplos cotidianos
- **🧴 Capacidad** — kl, l, dl, cl, ml con equivalencias y ejemplos cotidianos

Cada sección incluye un **🧠 Truco** para recordar el orden de las unidades.

---

## ⚙️ Mecánica de puntuación

| Resultado | Puntos |
|---|:---:|
| Respuesta correcta | +10 pts |
| Respuesta incorrecta | 0 pts |

---

## 🎨 Diseño y tecnología

- **Fuentes:** Baloo 2 (títulos) + Nunito (texto) — Google Fonts
- **Paleta pastel** con variables CSS (`:root`)
- **Fondo animado** con emojis flotantes
- **Cards** con bordes degradados, sombras suaves y bordes redondeados
- **Animaciones CSS:** `bounce`, `pulse`, `cardIn`, `popIn`, `confettiFall`, `floatUp`
- **100% Vanilla** — sin frameworks ni dependencias externas
- **Responsive** — adaptado a móvil y escritorio

---

## 📝 Estructura del fichero `datos.json`

El banco de preguntas es completamente externo y editable sin tocar el código.

### Pregunta de opción múltiple
```json
{
  "id": 1,
  "tipo": "opcion_multiple",
  "categoria": "longitud",
  "pregunta": "¿Cuántos centímetros tiene 1 metro?",
  "opciones": ["10 cm", "100 cm", "1.000 cm", "50 cm"],
  "correcta": 1,
  "explicacion": "¡Exacto! 1 metro = 100 centímetros.",
  "emoji": "📏"
}
```

| Campo | Descripción |
|---|---|
| `id` | Identificador único de la pregunta |
| `tipo` | Tipo de pregunta (`opcion_multiple`) |
| `categoria` | Categoría: `longitud`, `masa`, `capacidad` o `mixta` |
| `pregunta` | Enunciado que se muestra al jugador |
| `opciones` | Array con exactamente 4 opciones de respuesta |
| `correcta` | Índice (0–3) de la opción correcta |
| `explicacion` | Texto de feedback educativo |
| `emoji` | Emoji decorativo de la pregunta |

### Sección del tema (para el modal de repaso)
```json
{
  "icono": "📏",
  "nombre": "Longitud",
  "descripcion": "Medimos lo largo que es algo.",
  "unidades": [
    {
      "nombre": "kilómetro",
      "simbolo": "km",
      "equivalencia": "1 km = 1.000 m",
      "ejemplo": "La distancia entre dos ciudades"
    }
  ],
  "truco": "🧠 Truco: km → m → cm → mm. ¡Cada paso ×10!"
}
```

---

## 🚀 Puesta en marcha

> ⚠️ El juego usa `fetch` para cargar el JSON, por lo que **necesita un servidor local**. No funcionará abriendo el `.html` directamente desde el explorador de archivos.

### Opción 1 — Node.js
```bash
npx serve .
```

### Opción 2 — Python
```bash
python -m http.server 8000
```

### Opción 3 — VS Code
Instala la extensión **Live Server** y haz clic en **Go Live** en la barra de estado.

Luego abre `http://localhost:PUERTO` en el navegador.

---

## 📱 Añadido PWA (capacidad installable / offline)

- `manifest.json` con nombre, iconos, color y modo `standalone`.
- `sw.js` que cachea recursos (shell + datos) y responde en modo offline.
- `index.html` incluye: `manifest`, `theme-color`, `apple-mobile-web-app-capable`.
- `app.js` registra `serviceWorker` cuando está disponible.

> Después de abrir la app en navegador, el prompt de instalación de PWA se ofrecerá (en Chrome/Edge) o puedes añadir manualmente a pantalla inicio en móviles.

---

## 🌐 Publicar en GitHub Pages

1. Sube los 4 ficheros a un repositorio público en GitHub
2. Ve a **Settings → Pages**
3. En *Source*, selecciona la rama `main` y la carpeta `/ (root)`
4. Haz clic en **Save** — en unos minutos tendrás la URL pública

---

## ➕ Cómo añadir preguntas

Edita únicamente `datos.json` y añade un nuevo objeto al array `preguntas` siguiendo la estructura indicada arriba. No es necesario modificar ningún otro fichero.

---

## 📄 Licencia

Proyecto educativo de uso libre. Puedes adaptarlo y compartirlo libremente.