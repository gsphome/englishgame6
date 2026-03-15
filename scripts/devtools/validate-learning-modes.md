# Validate Learning Modes - MCP Chrome DevTools

Suite completa de pruebas E2E para los 6 modos de aprendizaje + validaciones generales.
Ejecutar con Chrome DevTools MCP contra producción: `https://gsphome.github.io/englishgame6/`

> Relacionado: `validate-modals.md` (modales), `automated-offline-test.md` (offline/PWA)

### Nota sobre navegación
Los module cards del menú no son clickeables via a11y tree. Usar siempre `evaluate_script` para navegar:
```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/{moduleId}'; return 'ok'; }"
```

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
- ✓ Status muestra "Global score: X correct, Y incorrect, Z% accuracy"
- ✓ Hay gridcells con módulos visibles
- ✓ Barra de búsqueda presente

---

## 1. Quiz Mode

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/quiz-basic-vocabulary-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Which word means", "What does"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# ANOTAR: texto de la pregunta, opciones visibles, session score = "0 correct"
```

**Interacción — responder una pregunta:**
```
# Click en una opción (usar uid del snapshot)
mcp_chrome_devtools_click
uid: {uid-opcion}
includeSnapshot: true
```

**Validar después de responder:**
- ✓ Session score cambió a "1 correct" o "1 incorrect"
- ✓ La pregunta es LA MISMA que antes de responder (no cambió)
- ✓ Aparece feedback: icono ✓ o ✗, explicación
- ✓ Botón "Next Question" visible
- ✓ URL sigue siendo `#/learn/quiz-basic-vocabulary-a1`

**Avanzar a siguiente pregunta:**
```
mcp_chrome_devtools_click
uid: {uid-next-question}
includeSnapshot: true
```

**Validar:**
- ✓ Pregunta nueva (diferente a la anterior)
- ✓ Score acumulado se mantiene
- ✓ Contador avanzó (ej: "2/10")

---

## 2. Completion Mode

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/completion-basic-sentences-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["____"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# ANOTAR: oración con blank, session score = "0 correct"
```

**Interacción — completar oración:**
```
# Escribir respuesta en el input
mcp_chrome_devtools_fill
uid: {uid-input}
value: "{respuesta}"

# Enviar
mcp_chrome_devtools_press_key
key: "Enter"
includeSnapshot: true
```

**Validar después de enviar:**
- ✓ Session score cambió a "1 correct" o "1 incorrect"
- ✓ La oración es LA MISMA que antes de responder
- ✓ Muestra "Correct!" o "Incorrect" con respuesta correcta
- ✓ Botón "Next Exercise" visible
- ✓ URL sigue siendo `#/learn/completion-basic-sentences-a1`

**Avanzar:**
```
mcp_chrome_devtools_click
uid: {uid-next-exercise}
includeSnapshot: true
```

**Validar:**
- ✓ Nueva oración con blank
- ✓ Score acumulado se mantiene

---

## 3. Matching Mode

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/matching-common-verbs-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Click items from both columns"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# ANOTAR: términos (columna izq), definiciones (columna der), contador "0/X"
```

**Interacción — emparejar todos los items:**
```
# Para cada par: click término → click definición
mcp_chrome_devtools_click
uid: {uid-term}

mcp_chrome_devtools_click
uid: {uid-definition}
includeSnapshot: true

# Verificar que contador incrementó (ej: "1/6")
# Repetir hasta "X/X"
```

**Cuando todos emparejados — verificar y enviar:**
```
# Debe decir "All matched! Check your answers"
# Click "Check Matches"
mcp_chrome_devtools_click
uid: {uid-check-matches}
includeSnapshot: true
```

**Validar después de Check:**
- ✓ Session score cambió (ej: "1 correct, 0 incorrect")
- ✓ Pares siguen visibles con sus emparejamientos
- ✓ Heading sigue siendo el mismo módulo
- ✓ Botones "Finish Exercise" y "View Summary" aparecen
- ✓ URL no cambió
- ✓ Pares NO se reiniciaron (no se barajaron de nuevo)

---

## 4. Sorting Mode

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/sorting-word-categories-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Drag and drop words"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# ANOTAR: palabras disponibles, categorías, contador "0/X"
```

**Interacción — arrastrar palabras a categorías:**
```
# IMPORTANTE: tomar snapshot DESPUÉS de cada drag (uids cambian al mover)
mcp_chrome_devtools_drag
from_uid: {uid-palabra}
to_uid: {uid-categoria}

mcp_chrome_devtools_take_snapshot
# Verificar contador incrementó, palabra movida a categoría correcta
# Repetir hasta "X/X - All words sorted!"
```

**Cuando todas clasificadas — verificar:**
```
mcp_chrome_devtools_click
uid: {uid-check-answers}
includeSnapshot: true
```

**Validar después de Check:**
- ✓ Session score cambió
- ✓ Categorías muestran checkmarks (✓) para correctas
- ✓ Heading sigue siendo el mismo módulo
- ✓ Botones "Finish Sorting" y "View Summary" aparecen
- ✓ URL no cambió
- ✓ Palabras NO volvieron a "Available Words"

---

## 5. Flashcard Mode

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/flashcard-basic-vocabulary-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Flip", "1/"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# ANOTAR: texto frontal de la tarjeta, contador "1/X"
```

**Interacción — voltear tarjeta:**
```
# Click en botón Flip (o click en la tarjeta)
mcp_chrome_devtools_click
uid: {uid-flip-btn}
includeSnapshot: true
```

**Validar después de flip:**
- ✓ Tarjeta muestra el reverso (traducción/definición)
- ✓ Texto frontal sigue visible en el reverso
- ✓ Botón cambia a "Flip Back"
- ✓ Contador no cambió (sigue "1/X")

**Avanzar a siguiente tarjeta:**
```
# Click flecha derecha (next)
mcp_chrome_devtools_click
uid: {uid-next-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Nueva tarjeta (texto diferente)
- ✓ Contador avanzó ("2/X")
- ✓ Tarjeta empieza por el frente (no volteada)

**Navegar hacia atrás:**
```
mcp_chrome_devtools_click
uid: {uid-prev-btn}
includeSnapshot: true
```

**Validar:**
- ✓ Vuelve a tarjeta anterior
- ✓ Contador retrocedió ("1/X")

**Keyboard navigation:**
```
# Flip con Space
mcp_chrome_devtools_press_key
key: " "
includeSnapshot: true

# Next con ArrowRight
mcp_chrome_devtools_press_key
key: "ArrowRight"
includeSnapshot: true

# Prev con ArrowLeft
mcp_chrome_devtools_press_key
key: "ArrowLeft"
includeSnapshot: true
```

---

## 6. Reading Mode

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/reading-greetings-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Learning Objectives", "Start Reading", "Greetings"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# ANOTAR: título, página de objetivos visible
```

**Interacción — navegar secciones:**
```
# Click "Start Reading" o flecha derecha
mcp_chrome_devtools_click
uid: {uid-next-btn}
includeSnapshot: true
```

**Validar primera sección:**
- ✓ Contenido de lectura visible (párrafos, texto)
- ✓ Contador muestra sección actual (ej: "1/3")
- ✓ Botones prev/next visibles

**Avanzar por todas las secciones:**
```
# Repetir click next hasta llegar al summary
mcp_chrome_devtools_click
uid: {uid-next-btn}
includeSnapshot: true
```

**Validar summary (última página):**
- ✓ Muestra "Key Vocabulary" y/o "Grammar Points" si existen
- ✓ Botón "Finish Reading" o equivalente
- ✓ Al hacer click en finish, vuelve al menú

**Validar retorno al menú:**
```
mcp_chrome_devtools_click
uid: {uid-finish-btn}
includeSnapshot: true
```

- ✓ URL cambió a `#/menu`
- ✓ Módulo de reading aparece como "Completed"

---

## 7. Validaciones generales

### 7a. Header y Score Display

```
# Desde cualquier módulo de aprendizaje, verificar header
mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Header muestra "FluentFlow" con heading level 1
- ✓ Status muestra session score (en modo learning) o global score (en menú)
- ✓ Botón de navegación/settings presente
- ✓ Botón de login presente

### 7b. Navegación menú → módulo → menú

```
# Desde menú, navegar a un módulo
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/quiz-basic-vocabulary-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Which word means", "What does"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
# Verificar que estamos en el módulo

# Volver al menú con botón "Return to main menu"
mcp_chrome_devtools_click
uid: {uid-return-menu}
includeSnapshot: true
```

**Validar:**
- ✓ URL cambió a `#/menu`
- ✓ Menú principal visible con todos los módulos
- ✓ Global score visible (no session score)

### 7c. Navegación directa por hash

```
# Probar navegación directa a diferentes modos
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/flashcard-everyday-life-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Flip", "1/"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Módulo carga correctamente sin pasar por menú
- ✓ Session score se reinicia a 0

### 7d. Módulo inexistente

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/nonexistent-module-xyz'; return 'ok'; }"

mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Muestra error UI (no crash)
- ✓ Botón "Try Again" o "Return to Menu" visible
- ✓ No hay errores JS en console

```
mcp_chrome_devtools_list_console_messages
types: ["error"]
pageSize: 20
```

### 7e. Console limpia durante uso normal

```
# Navegar al menú
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/menu'; return 'ok'; }"

# Limpiar console
mcp_chrome_devtools_evaluate_script
function: "() => { console.clear(); return 'cleared'; }"

# Navegar a un módulo, interactuar, volver
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/quiz-basic-vocabulary-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Which word means", "What does"]
timeout: 5000

# Responder una pregunta (click opción)
mcp_chrome_devtools_click
uid: {uid-opcion}

# Verificar console
mcp_chrome_devtools_list_console_messages
types: ["error", "warn"]
pageSize: 20
```

**Validar:**
- ✓ No hay errores de React ("unmounted component", "state update")
- ✓ No hay warnings de keys duplicadas
- ✓ No hay errores de red inesperados

### 7f. Persistencia de progreso

```
# Verificar localStorage
mcp_chrome_devtools_evaluate_script
function: "() => {
  const keys = Object.keys(localStorage).filter(k => k.includes('progress') || k.includes('score') || k.includes('user'));
  return keys.map(k => ({ key: k, size: localStorage.getItem(k).length }));
}"

# Recargar página
mcp_chrome_devtools_navigate_page
type: "reload"
timeout: 10000

mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Global score se mantiene después de reload
- ✓ Módulos completados siguen marcados como "Completed"
- ✓ localStorage contiene datos de progreso

### 7g. Responsive / viewport

```
# Desktop
mcp_chrome_devtools_resize_page
width: 1280
height: 800

mcp_chrome_devtools_take_screenshot
filePath: "scripts/devtools/responsive-desktop.png"

# Tablet
mcp_chrome_devtools_resize_page
width: 768
height: 1024

mcp_chrome_devtools_take_screenshot
filePath: "scripts/devtools/responsive-tablet.png"

# Mobile
mcp_chrome_devtools_resize_page
width: 375
height: 667

mcp_chrome_devtools_take_screenshot
filePath: "scripts/devtools/responsive-mobile.png"
```

**Validar:**
- ✓ Layout se adapta sin overflow horizontal
- ✓ Cards del menú se reorganizan
- ✓ Botones son accesibles en mobile
- ✓ Texto no se corta

### 7h. Zustand selector regression check

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  // Verificar que no hay suscripciones completas al store en componentes críticos
  // Esto es una verificación de código, no de runtime
  return {
    note: 'Verificar manualmente con grep',
    command: 'grep -r \"useAppStore()\" src/components/learning/ src/components/layout/AppRouter.tsx src/App.tsx src/components/ui/Header.tsx',
    expected: 'No matches (todos deben usar selectores)'
  };
}"
```

**Verificación en código:**
```bash
grep -r "useAppStore()" src/components/learning/ src/components/layout/AppRouter.tsx src/App.tsx src/components/ui/Header.tsx
# Esperado: sin resultados
# Si hay resultados → regresión del bug de remount
```

---

## 8. Test de no-remount (anti-regresión)

Verifica que `updateSessionScore` no causa remount del componente.

```
# Navegar a quiz
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/quiz-basic-vocabulary-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Which word means", "What does"]
timeout: 5000

# Instalar detector de remount
mcp_chrome_devtools_evaluate_script
function: "() => {
  let remounts = 0;
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.removedNodes) {
        if (node.nodeType === 1 && node.querySelector && node.querySelector('h2')) {
          remounts++;
        }
      }
    }
  });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
  window.__remountDetector = { count: () => remounts, stop: () => observer.disconnect() };
  return 'Detector installed';
}"

# Tomar snapshot y anotar la pregunta
mcp_chrome_devtools_take_snapshot

# Responder la pregunta
mcp_chrome_devtools_click
uid: {uid-opcion}

# Verificar remounts
mcp_chrome_devtools_evaluate_script
function: "() => {
  const count = window.__remountDetector.count();
  window.__remountDetector.stop();
  return {
    remounts: count,
    verdict: count === 0 ? 'PASS - no remount detected' : 'FAIL - component remounted ' + count + ' times'
  };
}"
```

**Validar:**
- ✓ `remounts: 0` → PASS
- ✓ Si `remounts > 0` → regresión del bug, revisar selectores de Zustand

---

## Módulos de referencia por modo

| Modo | ID del módulo | Nivel |
|------|---------------|-------|
| Quiz | `quiz-basic-vocabulary-a1` | A1 |
| Quiz | `quiz-everyday-life-a1` | A1 |
| Quiz | `quiz-family-home-a2` | A2 |
| Quiz | `quiz-elementary-review-a2` | A2 |
| Completion | `completion-basic-sentences-a1` | A1 |
| Completion | `completion-greetings-practice-a1` | A1 |
| Completion | `completion-daily-activities-a2` | A2 |
| Completion | `completion-past-stories-a2` | A2 |
| Matching | `matching-common-verbs-a1` | A1 |
| Matching | `matching-basic-grammar-a1` | A1 |
| Matching | `matching-time-expressions-a2` | A2 |
| Matching | `matching-be-vs-go-a2` | A2 |
| Sorting | `sorting-word-categories-a1` | A1 |
| Sorting | `sorting-verb-tenses-a1` | A1 |
| Sorting | `sorting-past-tense-a2` | A2 |
| Sorting | `sorting-conditionals-b1` | B1 |
| Flashcard | `flashcard-basic-vocabulary-a1` | A1 |
| Flashcard | `flashcard-everyday-life-a1` | A1 |
| Flashcard | `flashcard-family-a2` | A2 |
| Flashcard | `flashcard-home-a2` | A2 |
| Reading | `reading-greetings-a1` | A1 |
| Reading | `reading-daily-life-a1` | A1 |
| Reading | `reading-travel-a1` | A1 |
| Reading | `reading-business-a2` | A2 |

---

## Señales de regresión

| Síntoma | Causa probable |
|---------|----------------|
| Al responder, pregunta cambia a otra diferente | `useAppStore()` sin selector en componente de learning o AppRouter |
| Pregunta nueva ya muestra resultado sin responder | Remount: `processedQuestionsRef` se reinicializa con shuffle diferente |
| Score no se actualiza al responder | `updateSessionScore` no se llama o selector roto |
| Componente muestra loading spinner al responder | AppRouter se re-renderiza y Suspense se activa |
| Console: "Can't perform state update on unmounted" | Componente se desmontó durante actualización de score |
| Pares de matching se barajan al hacer Check | Remount del MatchingComponent |
| Palabras de sorting vuelven a Available Words | Remount del SortingComponent |
| Flashcard vuelve a tarjeta 1 al voltear | Remount del FlashcardComponent |

---

## Checklist rápido post-deploy

```
[ ] Sitio accesible (HTTP 200)
[ ] Menú carga con módulos
[ ] Quiz: responder → score actualiza, pregunta no cambia
[ ] Completion: enviar → score actualiza, oración no cambia
[ ] Matching: Check → score actualiza, pares no se reinician
[ ] Sorting: Check → score actualiza, palabras no vuelven
[ ] Flashcard: flip funciona, next/prev funciona
[ ] Reading: navegar secciones, finish vuelve al menú
[ ] Console sin errores de React
[ ] Progreso persiste después de reload
```
