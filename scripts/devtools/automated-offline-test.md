# Automated Offline Test - MCP Chrome DevTools

Tests de modo offline y PWA contra producción: `https://gsphome.github.io/englishgame6/`

> Relacionado: `validate-learning-modes.md` (funcionalidad core), `validate-modals.md` (UI/UX)

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
- ✓ Módulos visibles en gridcells

---

## 1. Carga inicial ONLINE

```
mcp_chrome_devtools_list_network_requests
resourceTypes: ["document", "script", "fetch", "xhr"]
pageSize: 50
```

**Validar:**
- ✓ Requests incluyen módulos JSON (`/data/app-config.json`, etc.)
- ✓ Status 200 en requests principales
- ✓ No hay requests fallidos inesperados

### Verificar Service Worker

```
mcp_chrome_devtools_evaluate_script
function: "async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  return {
    active: !!reg?.active,
    waiting: !!reg?.waiting,
    installing: !!reg?.installing,
    scope: reg?.scope
  };
}"
```

**Validar:**
- ✓ `active: true`
- ✓ `scope` incluye `/englishgame6/`

---

## 2. Completar módulo para activar next-module

```
# Navegar a un módulo de reading (más fácil de completar)
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/learn/reading-greetings-a1'; return 'ok'; }"

mcp_chrome_devtools_wait_for
text: ["Learning Objectives", "Start Reading", "Greetings"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
```

**Interacción — navegar todas las secciones:**
```
# Click next repetidamente hasta llegar al final
mcp_chrome_devtools_click
uid: {uid-next-btn}
includeSnapshot: true

# Repetir hasta ver "Finish Reading" o equivalente
# Click finish para volver al menú
mcp_chrome_devtools_click
uid: {uid-finish-btn}
includeSnapshot: true
```

**Validar:**
- ✓ URL cambió a `#/menu`
- ✓ Módulo aparece como "Completed"
- ✓ Next-module destacado en el menú

### Verificar progreso en localStorage

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  const keys = Object.keys(localStorage).filter(k => k.includes('progress') || k.includes('score') || k.includes('fluentflow'));
  return keys.map(k => ({ key: k, size: localStorage.getItem(k).length }));
}"
```

**Validar:**
- ✓ Hay datos de progreso guardados
- ✓ Size > 0

---

## 3. Modo OFFLINE - Navegación básica

```
# Activar modo offline
mcp_chrome_devtools_emulate
networkConditions: "Offline"

# Recargar página
mcp_chrome_devtools_navigate_page
type: "reload"
timeout: 10000

# Verificar que app carga desde cache
mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ App carga completamente (heading "FluentFlow" visible)
- ✓ Módulos visibles en gridcells
- ✓ Progreso persistido (módulo completado sigue marcado)
- ✓ Global score se mantiene

### Verificar requests offline

```
mcp_chrome_devtools_list_network_requests
pageSize: 30
```

**Validar:**
- ✓ Requests servidos desde Service Worker cache
- ✓ No hay errores de red que rompan la UI

---

## 4. CASO DE BORDE - Next-module OFFLINE

```
# Mantener modo offline
mcp_chrome_devtools_take_snapshot
# Identificar el next-module destacado

# Navegar al next-module
mcp_chrome_devtools_evaluate_script
function: "() => {
  const nextBtn = document.querySelector('[data-module-id].module-card--next-recommended');
  if (!nextBtn) return { error: 'No next-module found' };
  const moduleId = nextBtn.getAttribute('data-module-id');
  window.location.hash = '#/learn/' + moduleId;
  return { navigatedTo: moduleId };
}"

mcp_chrome_devtools_wait_for
text: ["Flip", "Which word", "Click items", "Drag and drop", "____", "Learning Objectives"]
timeout: 5000

mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Módulo carga correctamente offline (contenido JSON desde cache)
- ✓ No hay pantalla de error
- ✓ Interacción funciona (botones responden)

### Volver al menú

```
mcp_chrome_devtools_evaluate_script
function: "() => { window.location.hash = '#/menu'; return 'ok'; }"

mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Menú carga correctamente
- ✓ Progreso se mantiene

---

## 5. Cambio de vista OFFLINE

```
# Mantener modo offline
mcp_chrome_devtools_take_snapshot
# Identificar tabs disponibles

# Click en tab "All Modules" (si existe)
mcp_chrome_devtools_click
uid: {uid-tab-all}
includeSnapshot: true

# Click en tab "My Progress" (si existe)
mcp_chrome_devtools_click
uid: {uid-tab-progress}
includeSnapshot: true
```

**Validar:**
- ✓ Navegación entre tabs funciona offline
- ✓ Dashboard muestra stats correctos
- ✓ Módulos completados marcados correctamente

---

## 6. Volver ONLINE - Sincronización

```
# Desactivar modo offline (string vacío resetea)
mcp_chrome_devtools_emulate

# Recargar
mcp_chrome_devtools_navigate_page
type: "reload"
timeout: 10000

mcp_chrome_devtools_take_snapshot
```

**Validar:**
- ✓ Progreso se mantiene intacto
- ✓ Módulos completados siguen marcados
- ✓ Next-module sigue siendo el correcto

### Verificar requests exitosos

```
mcp_chrome_devtools_list_network_requests
resourceTypes: ["fetch", "xhr"]
pageSize: 30
```

**Validar:**
- ✓ Requests exitosos (status 200)

---

## 7. Edge Case - Sin cache inicial

```
# Abrir nueva página en contexto aislado (sin cache)
mcp_chrome_devtools_new_page
url: "about:blank"
isolatedContext: "test-no-cache"

# Activar offline ANTES de navegar
mcp_chrome_devtools_emulate
networkConditions: "Offline"

# Intentar cargar app
mcp_chrome_devtools_navigate_page
type: "url"
url: "https://gsphome.github.io/englishgame6/"
timeout: 10000

mcp_chrome_devtools_take_snapshot

mcp_chrome_devtools_list_console_messages
types: ["error", "warn"]
pageSize: 20
```

**Validar:**
- ✓ App muestra error apropiado (no crash silencioso)
- ✓ No hay excepciones JS no manejadas
- ✓ Fallback UI visible si existe

### Cleanup

```
# Cerrar página de test aislado
mcp_chrome_devtools_list_pages
# Cerrar la página del contexto aislado
mcp_chrome_devtools_close_page
pageId: {id-pagina-aislada}
```

---

## 8. Performance OFFLINE

```
# Seleccionar página principal (no la aislada)
mcp_chrome_devtools_list_pages
mcp_chrome_devtools_select_page
pageId: {id-pagina-principal}

# Asegurar online primero para tener cache
mcp_chrome_devtools_emulate

mcp_chrome_devtools_navigate_page
type: "url"
url: "https://gsphome.github.io/englishgame6/"
timeout: 10000

# Activar offline
mcp_chrome_devtools_emulate
networkConditions: "Offline"

# Performance trace
mcp_chrome_devtools_performance_start_trace
reload: true
autoStop: true
filePath: "scripts/devtools/perf-offline-trace.json.gz"
```

**Validar:**
- ✓ LCP < 2.5s
- ✓ FCP < 1.8s
- ✓ No layout shifts significativos (CLS < 0.1)

### Cleanup final

```
# Restaurar online
mcp_chrome_devtools_emulate
```

---

## Debugging

### Ver localStorage completo

```
mcp_chrome_devtools_evaluate_script
function: "() => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key).length + ' chars';
  }
  return data;
}"
```

### Ver cache storage

```
mcp_chrome_devtools_evaluate_script
function: "async () => {
  const names = await caches.keys();
  const details = {};
  for (const name of names) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    details[name] = keys.length + ' entries';
  }
  return details;
}"
```

### Ver Service Worker status

```
mcp_chrome_devtools_evaluate_script
function: "async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  return {
    active: !!reg?.active,
    waiting: !!reg?.waiting,
    installing: !!reg?.installing,
    scope: reg?.scope,
    updateViaCache: reg?.updateViaCache
  };
}"
```

---

## Resultados esperados

| Test | Online | Offline (con cache) | Sin cache |
|------|--------|---------------------|-----------|
| Carga inicial | ✓ | ✓ | ✗ (error esperado) |
| Completar módulo | ✓ | ✓ | N/A |
| Next-module | ✓ | ✓ | N/A |
| Navegación tabs | ✓ | ✓ | N/A |
| Persistencia | ✓ | ✓ | N/A |
| Performance | Excelente | Bueno | N/A |

---

## Checklist rápido post-deploy

```
[ ] Sitio accesible online (HTTP 200)
[ ] Service Worker activo
[ ] Modo offline: app carga desde cache
[ ] Modo offline: módulos navegables
[ ] Modo offline: progreso persiste
[ ] Vuelta online: progreso intacto
[ ] Sin errores JS en console durante todo el flujo
```
