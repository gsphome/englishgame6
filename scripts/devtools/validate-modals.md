# Validate Modals - MCP Chrome DevTools

Suite completa de pruebas E2E para todos los modales y paneles de la aplicación.
Ejecutar con Chrome DevTools MCP contra producción: `https://gsphome.github.io/englishgame6/`

> Relacionado: `validate-learning-modes.md` (modos de aprendizaje), `automated-offline-test.md` (offline/PWA)

## Prerequisitos

```bash
curl -I https://gsphome.github.io/englishgame6/  # Verificar sitio activo
```

---

## 0. Setup inicial

```
mcp_chrome_devtools_new_page
url: "https://gsphome.github.io/englishgame6/"
timeout: 10000

mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ URL contiene `#/menu`
- ✓ Snapshot muestra heading "FluentFlow"
- ✓ Botón hamburger (☰) visible
- ✓ Botón de usuario/login visible en header

---

## 1. Side Menu (Hamburger)

### 1a. Abrir side menu

```
# Click en botón hamburger (Menu)
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Overlay oscuro visible (`.header-side-menu-overlay`)
- ✓ Panel lateral aparece con heading "FluentFlow"
- ✓ Subtítulo "Navigation & Settings" visible
- ✓ Secciones visibles: "Main Navigation", "Configuration", "User Account"
- ✓ Items: Main Menu, Progress Dashboard, Learning Path, Advanced Settings, About FluentFlow
- ✓ Login/Logout visible según estado de usuario

### 1b. Cerrar con overlay click

```
# Click en el overlay (fuera del panel)
mcp_chrome_devtools_click
uid: {uid-overlay}
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró
- ✓ Overlay desapareció
- ✓ Menú principal visible de nuevo

### 1c. Cerrar con Escape

```
# Abrir side menu de nuevo
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

# Cerrar con Escape
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró con Escape
- ✓ Overlay desapareció

### 1d. Navegación desde side menu

```
# Abrir side menu
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

# Click en "Main Menu"
mcp_chrome_devtools_click
uid: {uid-main-menu-item}
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró automáticamente
- ✓ URL es `#/menu`
- ✓ Menú principal visible

---

## 2. Profile Modal (CompactProfile)

### 2a. Abrir desde header (usuario no logueado)

```
# Click en botón Login del header
mcp_chrome_devtools_click
uid: {uid-login-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Modal de perfil visible con overlay
- ✓ Heading "User Profile" con icono de usuario
- ✓ Botón X de cierre visible (`.modal__close-btn`)
- ✓ Body scroll deshabilitado (`body:has(.compact-profile)` → `overflow: hidden`)
- ✓ Secciones visibles: "Basic Info", "Preferences", "Interested Categories"

### 2b. Validar campos del formulario

```
mcp_chrome_devtools_take_snapshot
```

**Validar campos presentes:**
- ✓ Input "Name" (text, required)
- ✓ Select "English Level" (beginner/intermediate/advanced)
- ✓ Select "Language" (English/Español)
- ✓ Input "Daily Goal" (number, min 1, max 100, suffix "min")
- ✓ Range "Difficulty" (1-5, muestra emoji + label)
- ✓ Checkboxes de categorías: Vocabulary, Grammar, PhrasalVerbs, Idioms
- ✓ Checkbox "Enable Notifications"
- ✓ Botón "Save Profile" con icono Save

### 2c. Llenar formulario y guardar

```
# Llenar nombre
mcp_chrome_devtools_fill
uid: {uid-name-input}
value: "Test User"

# Seleccionar nivel
mcp_chrome_devtools_fill
uid: {uid-level-select}
value: "intermediate"

# Click en Save Profile
mcp_chrome_devtools_click
uid: {uid-save-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró
- ✓ Header ahora muestra "Test User" en lugar de "Login"
- ✓ Botón de usuario muestra nombre del usuario

### 2d. Validación de formulario (nombre vacío)

```
# Abrir profile modal
mcp_chrome_devtools_click
uid: {uid-user-btn}
includeSnapshot: true

# Limpiar nombre y enviar
mcp_chrome_devtools_fill
uid: {uid-name-input}
value: ""

mcp_chrome_devtools_click
uid: {uid-save-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Modal NO se cerró
- ✓ Mensaje de error visible bajo el campo nombre
- ✓ Clase `compact-profile__input--error` aplicada al input

### 2e. Cerrar con Escape

```
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró sin guardar
- ✓ Body scroll restaurado

### 2f. Abrir desde side menu

```
# Abrir side menu
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

# Click en "Edit Profile" (o "Login" si no logueado)
mcp_chrome_devtools_click
uid: {uid-edit-profile-item}
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró
- ✓ Profile modal se abrió
- ✓ Datos del usuario precargados si ya existe

---

## 3. Settings Modal (CompactAdvancedSettings)

### 3a. Abrir desde side menu

```
# Abrir side menu
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

# Click en "Advanced Settings"
mcp_chrome_devtools_click
uid: {uid-settings-item}
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró
- ✓ Settings modal visible con overlay
- ✓ Heading "Advanced Settings" con icono ⚙️
- ✓ Botón X de cierre visible
- ✓ Body scroll deshabilitado (`body:has(.compact-settings)`)
- ✓ 4 tabs visibles: General, Games, Categories, Offline

### 3b. Tab General

```
mcp_chrome_devtools_take_snapshot
```

**Validar (tab General activo por defecto):**
- ✓ Select "Theme" (light/dark)
- ✓ Select "Language" (English/Español)
- ✓ Select "Level" (A1-C2)
- ✓ Toggle "Development Mode"
- ✓ Toggle "Randomize Items"

### 3c. Tab Games

```
# Click en tab "Games"
mcp_chrome_devtools_click
uid: {uid-games-tab}
includeSnapshot: true
```

**Validar:**
- ✓ Tab "Games" activo (clase `compact-settings__tab--active`)
- ✓ Campos de configuración de juegos visibles (quiz options, time limits, etc.)

### 3d. Tab Categories

```
# Click en tab "Categories"
mcp_chrome_devtools_click
uid: {uid-categories-tab}
includeSnapshot: true
```

**Validar:**
- ✓ Tab "Categories" activo
- ✓ Lista de categorías con toggles visibles

### 3e. Tab Offline

```
# Click en tab "Offline"
mcp_chrome_devtools_click
uid: {uid-offline-tab}
includeSnapshot: true
```

**Validar:**
- ✓ Tab "Offline" activo
- ✓ Toggle "Enable Offline Mode" visible
- ✓ Checkboxes de niveles (A1-C2) para descargar
- ✓ Botón "Download" o "Manage Downloads" según estado
- ✓ Info de cache size si hay datos descargados

### 3f. Cambiar tema y verificar

```
# Volver a tab General
mcp_chrome_devtools_click
uid: {uid-general-tab}
includeSnapshot: true

# Cambiar tema a dark
mcp_chrome_devtools_fill
uid: {uid-theme-select}
value: "dark"

# Guardar
mcp_chrome_devtools_click
uid: {uid-save-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró
- ✓ Tema cambió (clase `dark` en `<html>`)
- ✓ Header y menú reflejan dark mode

```
# Verificar dark mode aplicado
mcp_chrome_devtools_evaluate_script
function: "() => document.documentElement.classList.contains('dark')"
```

### 3g. Cerrar con Escape

```
# Reabrir settings
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-settings-item}
includeSnapshot: true

# Cerrar con Escape
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró
- ✓ Body scroll restaurado

---

## 4. About Modal (CompactAbout)

### 4a. Abrir desde side menu

```
# Abrir side menu
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

# Click en "About FluentFlow"
mcp_chrome_devtools_click
uid: {uid-about-item}
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró
- ✓ About modal visible con overlay
- ✓ Logo FluentFlow visible
- ✓ Heading "About FluentFlow"
- ✓ Body scroll deshabilitado (`body:has(.compact-about)`)

### 4b. Validar contenido

```
mcp_chrome_devtools_take_snapshot
```

**Validar secciones:**
- ✓ App Info: Version "2.0.0", Platform "Web", Build date (MM/DD + HH:MM)
- ✓ Features: 4 features con emojis (📚, 🎯, 📊, 🌐)
- ✓ Developer: "Genil Suárez" con link a GitHub
- ✓ Tech Stack: React, TypeScript, CSS, Zustand, Vite
- ✓ Botón "Close" en footer

### 4c. Screen Info sub-modal

```
# Click en "React" (botón clickable en tech stack)
mcp_chrome_devtools_click
uid: {uid-react-tech-item}
includeSnapshot: true
```

**Validar:**
- ✓ Sub-modal "Screen Information" aparece sobre el About modal
- ✓ Icono Monitor visible
- ✓ Campos: Resolution, Viewport, Pixel Ratio, Color Depth, Orientation
- ✓ Valores numéricos presentes (no vacíos)
- ✓ Botón X para cerrar sub-modal

### 4d. Cerrar Screen Info sub-modal

```
# Click X del sub-modal
mcp_chrome_devtools_click
uid: {uid-screen-info-close}
includeSnapshot: true
```

**Validar:**
- ✓ Sub-modal se cerró
- ✓ About modal sigue visible debajo

### 4e. Cerrar About modal

```
# Click botón "Close" del footer
mcp_chrome_devtools_click
uid: {uid-close-btn}
includeSnapshot: true
```

**Validar:**
- ✓ About modal se cerró
- ✓ Screen Info sub-modal también se cerró (si estaba abierto)
- ✓ Body scroll restaurado

### 4f. Cerrar con Escape (cierra ambos modales)

```
# Reabrir About
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-about-item}
includeSnapshot: true

# Abrir Screen Info
mcp_chrome_devtools_click
uid: {uid-react-tech-item}
includeSnapshot: true

# Escape cierra todo
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Ambos modales cerrados
- ✓ Body scroll restaurado

---

## 5. Progress Dashboard Modal (CompactProgressDashboard)

### 5a. Abrir desde side menu

```
# Abrir side menu
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

# Click en "Progress Dashboard"
mcp_chrome_devtools_click
uid: {uid-progress-item}
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró
- ✓ Progress Dashboard modal visible
- ✓ Heading "Progress Dashboard" con icono BarChart3
- ✓ Body scroll deshabilitado (`body:has(.compact-progress-dashboard)`)

### 5b. Validar contenido

```
mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Score total visible (correct, incorrect, accuracy %)
- ✓ Datos de progreso por nivel o categoría
- ✓ Botón "Continuar Aprendiendo" en footer

### 5c. Cerrar con botón

```
mcp_chrome_devtools_click
uid: {uid-continue-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró
- ✓ Body scroll restaurado

### 5d. Cerrar con Escape

```
# Reabrir
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-progress-item}
includeSnapshot: true

mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró con Escape

---

## 6. Learning Path Modal (CompactLearningPath)

### 6a. Abrir desde side menu

```
# Abrir side menu
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

# Click en "Learning Path"
mcp_chrome_devtools_click
uid: {uid-learning-path-item}
includeSnapshot: true
```

**Validar:**
- ✓ Side menu se cerró
- ✓ Learning Path modal visible
- ✓ Heading "Learning Path" con icono MapPin
- ✓ Body scroll deshabilitado (`body:has(.compact-learning-path)`)

### 6b. Validar contenido

```
mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Progress Overview: porcentaje completado (📊 X%), módulos completados (X / Y)
- ✓ Next Recommended: módulo sugerido con nivel (A1-C2), tipo y nombre
- ✓ Unit Progress: 6 círculos SVG (A1, A2, B1, B2, C1, C2) con porcentaje
- ✓ Cada círculo muestra: código nivel, porcentaje, nombre corto, ratio completados/total
- ✓ Botón "Continuar Aprendiendo" en footer

### 6c. Cerrar con botón

```
mcp_chrome_devtools_click
uid: {uid-continue-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró
- ✓ Body scroll restaurado

### 6d. Cerrar con Escape

```
# Reabrir
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-learning-path-item}
includeSnapshot: true

mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró con Escape

---

## 7. Download Manager Modal (DownloadManagerModal)

> Nota: Este modal se abre desde el tab "Offline" del Settings modal.
> Requiere que haya niveles descargados para mostrar contenido.

### 7a. Abrir Download Manager

```
# Abrir Settings → tab Offline
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-settings-item}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-offline-tab}
includeSnapshot: true

# Click en "Manage Downloads" (si hay datos descargados)
mcp_chrome_devtools_click
uid: {uid-manage-downloads-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Download Manager modal visible sobre Settings modal
- ✓ Heading "Manage Downloads"
- ✓ Botón X de cierre

### 7b. Validar contenido (con descargas)

```
mcp_chrome_devtools_take_snapshot
```

**Validar (si hay niveles descargados):**
- ✓ Lista de niveles descargados (ej: "A1", "A2")
- ✓ Cada nivel muestra: nombre, cantidad de módulos, tamaño
- ✓ Botón delete (🗑️) por cada nivel
- ✓ Total storage size visible
- ✓ Botón "Delete All"

**Validar (si NO hay descargas):**
- ✓ Mensaje "No downloads" o estado vacío

### 7c. Cerrar con overlay click

```
# Click fuera del modal container (en el overlay)
mcp_chrome_devtools_click
uid: {uid-download-overlay}
includeSnapshot: true
```

**Validar:**
- ✓ Download Manager se cerró
- ✓ Settings modal sigue visible debajo

### 7d. Cerrar con Escape

```
# Reabrir Download Manager
mcp_chrome_devtools_click
uid: {uid-manage-downloads-btn}
includeSnapshot: true

mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Download Manager se cerró (Escape deshabilitado en Settings cuando DM está abierto)
- ✓ Settings modal sigue visible

---

## 8. Sorting Summary Modal

> Este modal aparece dentro del SortingComponent después de completar y verificar el ejercicio.

### 8a. Completar ejercicio de sorting

```
# Navegar a sorting module
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/sorting-word-categories-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Drag and drop words"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# Arrastrar todas las palabras a categorías (ver validate-learning-modes.md sección 4)
# IMPORTANTE: tomar snapshot después de cada drag (uids cambian)
```

### 8b. Abrir summary modal

```
# Después de Check Answers, click en "View Summary"
mcp_chrome_devtools_click
uid: {uid-view-summary}
includeSnapshot: true
```

**Validar:**
- ✓ Modal overlay visible (`.sorting-modal`, `position: fixed`, `z-index: 50`)
- ✓ Container con header naranja (gradient `#ea580c → #f97316`)
- ✓ Heading "Exercise Summary"
- ✓ Botón X de cierre (`.sorting-modal__close-btn`)
- ✓ Animation: `modalFadeIn` + `modalSlideIn`

### 8c. Validar contenido del summary

```
mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Results grid con cards para cada palabra
- ✓ Cards correctas: borde verde (`#22c55e`), icono ✓
- ✓ Cards incorrectas: borde rojo (`#ef4444`), icono ✗
- ✓ Cada card muestra: palabra, respuesta correcta (categoría)
- ✓ Cards incorrectas muestran además: "Your Answer" con categoría elegida
- ✓ Explicación visible si existe en los datos
- ✓ Botón "Close" en footer (`.sorting-modal__close-button`)

### 8d. Scroll en modal con muchos resultados

```
# Verificar que el contenido es scrollable
mcp_chrome_devtools_evaluate_script
function: "() => {
  const content = document.querySelector('.sorting-modal__content');
  if (!content) return { error: 'no content element' };
  return {
    scrollHeight: content.scrollHeight,
    clientHeight: content.clientHeight,
    isScrollable: content.scrollHeight > content.clientHeight
  };
}"
```

**Validar:**
- ✓ Si hay muchos resultados, `isScrollable: true`
- ✓ Scrollbar visible (4px width, custom styled)

### 8e. Cerrar summary modal

```
mcp_chrome_devtools_click
uid: {uid-close-button}
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró
- ✓ Ejercicio de sorting sigue visible debajo
- ✓ Resultados del check siguen visibles (no se reiniciaron)

### 8f. Cerrar con botón X del header

```
# Reabrir summary
mcp_chrome_devtools_click
uid: {uid-view-summary}
includeSnapshot: true

# Click X
mcp_chrome_devtools_click
uid: {uid-close-x}
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró

---

## 9. Matching Summary Modal

> Este modal aparece dentro del MatchingComponent después de completar y verificar el ejercicio.
> Incluye body scroll management con `modal-open` class y `--scroll-y` CSS variable.

### 9a. Completar ejercicio de matching

```
# Navegar a matching module
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/matching-common-verbs-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Click items from both columns"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# Emparejar todos los items (ver validate-learning-modes.md sección 3)
# Click Check Matches
```

### 9b. Abrir summary modal

```
# Click en "View Summary"
mcp_chrome_devtools_click
uid: {uid-view-summary}
includeSnapshot: true
```

**Validar:**
- ✓ Modal overlay visible (`.matching-modal`, `position: fixed`, `z-index: 50`)
- ✓ Container con glassmorphism (`backdrop-filter: blur(20px)`)
- ✓ Header violeta (gradient `#8b5cf6 → #6366f1`)
- ✓ Heading "Exercise Summary"
- ✓ Botón X de cierre (`.matching-modal__close-btn`)
- ✓ Body tiene clase `modal-open` (scroll deshabilitado)

### 9c. Verificar body scroll lock

```
mcp_chrome_devtools_evaluate_script
function: "() => ({
  hasModalOpen: document.body.classList.contains('modal-open'),
  scrollY: document.documentElement.style.getPropertyValue('--scroll-y'),
  bodyOverflow: getComputedStyle(document.body).overflow
})"
```

**Validar:**
- ✓ `hasModalOpen: true`
- ✓ `scrollY` tiene valor negativo (posición guardada)
- ✓ `bodyOverflow: "hidden"`

### 9d. Validar contenido del summary

```
mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Results grid con cards horizontales (grid: `2rem 1fr`)
- ✓ Cards correctas: fondo verde claro, icono ✓ circular verde
- ✓ Cards incorrectas: fondo rojo claro, icono ✗ circular rojo
- ✓ Cada card muestra: status icon, término (bold), traducción correcta
- ✓ Cards incorrectas muestran además: respuesta del usuario (tachada, `text-decoration: line-through`)
- ✓ Botón "Close" en footer (`.matching-modal__close-button`)

### 9e. Individual explanation (click info button)

> Antes de abrir el summary, se puede hacer click en el botón ℹ️ de un par individual.

```
# Cerrar summary primero
mcp_chrome_devtools_click
uid: {uid-close-button}
includeSnapshot: true

# Click en botón info de un par
mcp_chrome_devtools_click
uid: {uid-info-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Modal muestra vista individual (no summary)
- ✓ Card con término y traducción
- ✓ Explicación detallada visible (`.matching-modal__detail-explanation`)
- ✓ Borde izquierdo violeta en la explicación (`border-left: 3px solid #8b5cf6`)

### 9f. Cerrar matching modal y verificar scroll restore

```
mcp_chrome_devtools_click
uid: {uid-close-button}
includeSnapshot: true

mcp_chrome_devtools_evaluate_script
function: "() => ({
  hasModalOpen: document.body.classList.contains('modal-open'),
  scrollY: document.documentElement.style.getPropertyValue('--scroll-y'),
  bodyOverflow: getComputedStyle(document.body).overflow
})"
```

**Validar:**
- ✓ `hasModalOpen: false`
- ✓ `scrollY` vacío (propiedad removida)
- ✓ Body scroll restaurado
- ✓ Posición de scroll restaurada (no saltó al top)

### 9g. Keyboard: cerrar con Enter o Escape

```
# Reabrir summary
mcp_chrome_devtools_click
uid: {uid-view-summary}
includeSnapshot: true

# Cerrar con Escape
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró con Escape
- ✓ Body scroll restaurado

```
# Reabrir y cerrar con Enter
mcp_chrome_devtools_click
uid: {uid-view-summary}
includeSnapshot: true

mcp_chrome_devtools_press_key
key: "Enter"
includeSnapshot: true
```

**Validar:**
- ✓ Modal se cerró con Enter

---

## 10. Validaciones generales de modales

### 10a. Z-index stacking

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  const zIndexes = {};
  const selectors = [
    '.header-side-menu-overlay',
    '.header-side-menu',
    '.compact-profile',
    '.compact-settings',
    '.compact-about',
    '.compact-progress-dashboard',
    '.compact-learning-path',
    '.download-manager',
    '.sorting-modal',
    '.matching-modal',
    '.screen-info-modal'
  ];
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      zIndexes[sel] = getComputedStyle(el).zIndex;
    }
  });
  return zIndexes;
}"
```

**Validar:**
- ✓ Side menu overlay: z-index 40
- ✓ Side menu: z-index 50
- ✓ Modales principales: z-index 50
- ✓ Screen info sub-modal: z-index 60 (encima del About)

### 10b. Body scroll prevention para todos los modales

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  // Verificar que la regla CSS existe
  const sheets = Array.from(document.styleSheets);
  let hasRule = false;
  for (const sheet of sheets) {
    try {
      const rules = Array.from(sheet.cssRules || []);
      for (const rule of rules) {
        if (rule.selectorText && rule.selectorText.includes('body:has(.compact-')) {
          hasRule = true;
          break;
        }
      }
    } catch(e) { /* cross-origin */ }
    if (hasRule) break;
  }
  return { hasScrollPreventionRule: hasRule };
}"
```

**Validar:**
- ✓ `hasScrollPreventionRule: true`
- ✓ Aplica a: `.compact-profile`, `.compact-settings`, `.compact-about`, `.compact-progress-dashboard`, `.compact-learning-path`

### 10c. Portal rendering (modales no dentro del header)

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  const header = document.querySelector('header');
  const modals = [
    '.compact-profile',
    '.compact-settings',
    '.compact-about',
    '.compact-progress-dashboard',
    '.compact-learning-path'
  ];
  const results = {};
  modals.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      results[sel] = {
        exists: true,
        isInHeader: header ? header.contains(el) : 'no header',
        parentTag: el.parentElement?.tagName
      };
    }
  });
  return results;
}"
```

**Validar:**
- ✓ Todos los modales tienen `parentTag: "BODY"` (renderizados via `createPortal`)
- ✓ Ninguno está dentro del `<header>` (`isInHeader: false`)

### 10d. Accessibility: focus trap y aria attributes

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  const modals = document.querySelectorAll(
    '.compact-profile, .compact-settings, .compact-about, .compact-progress-dashboard, .compact-learning-path, .sorting-modal, .matching-modal, .download-manager'
  );
  const results = [];
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('[aria-label]');
    const heading = modal.querySelector('h2, h3');
    results.push({
      class: modal.className.split(' ')[0],
      hasCloseWithAriaLabel: !!closeBtn,
      closeAriaLabel: closeBtn?.getAttribute('aria-label'),
      hasHeading: !!heading,
      headingText: heading?.textContent?.trim()
    });
  });
  return results;
}"
```

**Validar:**
- ✓ Cada modal tiene botón close con `aria-label`
- ✓ Cada modal tiene heading (h2 o h3)
- ✓ `aria-label` del close button es descriptivo (ej: "Close")

### 10e. Touch target sizes (44px minimum)

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  const closeButtons = document.querySelectorAll('.modal__close-btn, .sorting-modal__close-btn, .matching-modal__close-btn');
  return Array.from(closeButtons).map(btn => {
    const rect = btn.getBoundingClientRect();
    return {
      class: btn.className,
      width: rect.width,
      height: rect.height,
      meetsMinimum: rect.width >= 44 && rect.height >= 44
    };
  });
}"
```

**Validar:**
- ✓ Todos los botones close tienen `width >= 44` y `height >= 44`
- ✓ `meetsMinimum: true` para todos

### 10f. Animations respect prefers-reduced-motion

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  // Check if CSS has @media (prefers-reduced-motion: reduce) rules
  const sheets = Array.from(document.styleSheets);
  let hasReducedMotion = false;
  for (const sheet of sheets) {
    try {
      const rules = Array.from(sheet.cssRules || []);
      for (const rule of rules) {
        if (rule.conditionText && rule.conditionText.includes('prefers-reduced-motion')) {
          hasReducedMotion = true;
          break;
        }
      }
    } catch(e) { /* cross-origin */ }
    if (hasReducedMotion) break;
  }
  return { hasReducedMotionSupport: hasReducedMotion };
}"
```

**Validar:**
- ✓ `hasReducedMotionSupport: true`
- ✓ Sorting modal y Matching modal tienen `animation: none` en reduced motion

### 10g. Console limpia durante apertura/cierre de modales

```
# Limpiar console
mcp_chrome_devtools_evaluate_script
function: "() => { console.clear(); return 'cleared'; }"

# Abrir y cerrar cada modal rápidamente
mcp_chrome_devtools_evaluate_script
function: "() => {
  // Simular apertura rápida de side menu
  const menuBtn = document.querySelector('[aria-label*=\"menu\" i], [aria-label*=\"Menu\" i]');
  if (menuBtn) menuBtn.click();
  setTimeout(() => {
    const overlay = document.querySelector('.header-side-menu-overlay');
    if (overlay) overlay.click();
  }, 300);
  return 'triggered menu open/close';
}"

# Verificar console
mcp_chrome_devtools_list_console_messages
types: ["error", "warn"]
pageSize: 20
```

**Validar:**
- ✓ No hay errores de React ("unmounted component", "state update on unmounted")
- ✓ No hay warnings de memory leaks
- ✓ No hay errores de event listeners

### 10h. Dark mode en todos los modales

```
# Asegurar dark mode activo
mcp_chrome_devtools_evaluate_script
function: "() => {
  document.documentElement.classList.add('dark');
  return 'dark mode enabled';
}"

# Abrir About modal (ejemplo)
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-about-item}
includeSnapshot: true

mcp_chrome_devtools_take_screenshot
filePath: "scripts/devtools/modal-dark-mode.png"
```

**Validar visualmente:**
- ✓ Background oscuro en container
- ✓ Texto legible (contraste suficiente)
- ✓ Bordes visibles en dark mode (`--theme-border-modal-dark`)
- ✓ Botones con estilos dark mode aplicados

### 10i. Responsive: modales en mobile

```
# Resize a mobile
mcp_chrome_devtools_resize_page
width: 375
height: 667

# Abrir un modal
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_take_screenshot
filePath: "scripts/devtools/side-menu-mobile.png"
```

**Validar:**
- ✓ Side menu ocupa `min(85vw, 320px)` en mobile
- ✓ Modales no desbordan viewport
- ✓ Botones accesibles con touch
- ✓ Scroll funciona dentro del modal content

```
# Restaurar desktop
mcp_chrome_devtools_resize_page
width: 1280
height: 800
```

---

## Inventario de modales

| # | Modal | Componente | CSS Class | Trigger | Escape | Portal |
|---|-------|-----------|-----------|---------|--------|--------|
| 1 | Side Menu | Header.tsx (inline) | `.header-side-menu` | Hamburger btn | ✓ | No (inline) |
| 2 | Profile | CompactProfile.tsx | `.compact-profile` | Header user btn / Side menu | ✓ | ✓ `createPortal` |
| 3 | Settings | CompactAdvancedSettings.tsx | `.compact-settings` | Side menu | ✓ | ✓ `createPortal` |
| 4 | About | CompactAbout.tsx | `.compact-about` | Side menu | ✓ | ✓ `createPortal` |
| 5 | Screen Info | CompactAbout.tsx (nested) | `.screen-info-modal` | "React" tech item | Via parent | No (inside About) |
| 6 | Progress | CompactProgressDashboard.tsx | `.compact-progress-dashboard` | Side menu | ✓ | ✓ `createPortal` |
| 7 | Learning Path | CompactLearningPath.tsx | `.compact-learning-path` | Side menu | ✓ | ✓ `createPortal` |
| 8 | Download Mgr | DownloadManagerModal.tsx | `.download-manager` | Settings → Offline tab | ✓ | No (inside Settings) |
| 9 | Sorting Summary | SortingComponent.tsx (inline) | `.sorting-modal` | "View Summary" btn | No (keyboard) | No (inline) |
| 10 | Matching Summary | MatchingComponent.tsx (inline) | `.matching-modal` | "View Summary" / ℹ️ btn | ✓ Enter/Esc | No (inline) |

## Scroll prevention por modal

| Modal | Mecanismo |
|-------|-----------|
| Profile, Settings, About, Progress, Learning Path | CSS `body:has(.compact-*)` → `overflow: hidden` |
| Matching Summary | JS: `body.classList.add('modal-open')` + `--scroll-y` CSS var |
| Sorting Summary | Ninguno explícito (modal overlay cubre viewport) |
| Side Menu | Overlay click cierra, no bloquea scroll |
| Download Manager | Hereda del Settings modal |

---

## 11. Modales dentro de learning modes

Verificar que abrir/cerrar modales no afecta el estado del learning mode activo.

### 11a. Settings dentro de Quiz

```
# Navegar a quiz
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/quiz-basic-vocabulary-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Which word means", "What does", "What do", "Which is"]
timeout: 5000

# Responder una pregunta
mcp_chrome_devtools_take_snapshot
# ANOTAR: pregunta, index (ej: 1/10), score
mcp_chrome_devtools_click
uid: {uid-opcion}
includeSnapshot: true
# ANOTAR: score actualizado, pregunta NO cambió

# Abrir side menu → Settings
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-settings-item}
includeSnapshot: true

# Cerrar con Escape
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Pregunta es la misma que antes de abrir Settings
- ✓ Score no cambió
- ✓ Index no cambió (sigue ej: 1/10)
- ✓ Botones de quiz siguen funcionales

### 11b. About dentro de Quiz

```
# Abrir side menu → About
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-about-item}
includeSnapshot: true

# Cerrar con Escape
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Estado del quiz intacto (misma pregunta, score, index)

### 11c. Profile dentro de Quiz

```
# Abrir side menu → Profile/Login
mcp_chrome_devtools_click
uid: {uid-menu-btn}
includeSnapshot: true

mcp_chrome_devtools_click
uid: {uid-profile-item}
includeSnapshot: true

# Cerrar con Escape
mcp_chrome_devtools_press_key
key: "Escape"
includeSnapshot: true
```

**Validar:**
- ✓ Estado del quiz intacto

### 11d. Modales dentro de otros modos

Repetir 11a-11c desde:
- Completion mode (`#/learn/completion-basic-sentences-a1`)
- Flashcard mode (`#/learn/flashcard-basic-vocabulary-a1`)

**Validar en cada caso:**
- ✓ Completion: misma oración, mismo input, mismo score
- ✓ Flashcard: misma tarjeta, mismo index, mismo estado flip

---

## Señales de regresión

| Síntoma | Causa probable |
|---------|----------------|
| Modal no se abre al click | Estado `show*` no se actualiza, verificar `useState` |
| Modal se abre pero no se ve | z-index insuficiente o `display: none` no removido |
| Body sigue scrollable con modal abierto | CSS `body:has()` no soportado o clase `modal-open` no aplicada |
| Scroll salta al cerrar matching modal | `--scroll-y` no restaurado o `window.scrollTo` falla |
| Modal aparece dentro del header (event bubbling) | `createPortal` removido, modal renderizado inline |
| Side menu no se cierra con Escape | `useEscapeKey` hook no conectado |
| Settings no guarda cambios | `handleSave` no llama a store setters |
| Profile form no valida | Zod schema o `zodResolver` desconectado |
| Screen Info sub-modal no se cierra con About | `handleClose` no llama `setShowScreenInfo(false)` |
| Download Manager Escape cierra Settings | `useEscapeKey(isOpen && !isModalOpen, onClose)` roto |
| Dark mode no aplica en modal | Falta selector `.dark` en CSS del modal |
| Botones close muy pequeños en mobile | Touch target < 44px, verificar `width/height: 2.75rem` |
| Animación brusca o flash al abrir | `modalFadeIn`/`modalSlideIn` keyframes rotos |
| Modal no responsive en mobile ≤400px | Media queries `@media (max-width: 400px)` faltantes |

---

## Checklist rápido post-deploy

```
[ ] Side menu: abre, cierra con overlay, cierra con Escape
[ ] Profile: abre desde header, form valida, guarda, cierra con Escape
[ ] Settings: abre, 4 tabs funcionan, guarda cambios, cierra con Escape
[ ] About: abre, Screen Info sub-modal funciona, cierra ambos con Escape
[ ] Progress Dashboard: abre, muestra datos, cierra
[ ] Learning Path: abre, muestra progreso por nivel, cierra
[ ] Download Manager: abre desde Settings/Offline, cierra sin cerrar Settings
[ ] Sorting Summary: abre post-check, muestra resultados correct/incorrect, cierra
[ ] Matching Summary: abre post-check, body scroll locked, cierra y restaura scroll
[ ] Body scroll: deshabilitado en todos los modales, restaurado al cerrar
[ ] Dark mode: todos los modales se ven correctamente
[ ] Mobile: modales no desbordan, botones accesibles
[ ] Console: sin errores de React al abrir/cerrar modales
[ ] Portal: modales compact-* renderizados en body (no en header)
[ ] Modales en learning: Settings/About/Profile no afectan estado de quiz/completion/flashcard
```
