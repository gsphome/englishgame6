# DevTools Testing & Artifacts

Directorio para pruebas E2E con Chrome DevTools MCP y artifacts generados durante testing/debugging.
Ejecutar contra producción: `https://gsphome.github.io/englishgame6/`

## Test Scripts

| Script | Cobertura |
|--------|-----------|
| `validate-learning-modes.md` | 6 modos de aprendizaje + 8 validaciones generales + anti-remount |
| `validate-modals.md` | 10 modales + 10 validaciones generales (z-index, scroll, a11y, dark mode) |
| `automated-offline-test.md` | 8 tests offline: cache, next-module, sync, performance |

## Prerequisitos

### Chrome con Remote Debugging

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222
```

### MCP Chrome DevTools

Configurado en `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-chrome-devtools@latest"],
      "disabled": false
    }
  }
}
```

## Workflow recomendado

```
1. Hacer cambios en código
2. npm run build:full (pull + quality + security + build + push + deploy)
3. Ejecutar test scripts relevantes con Chrome DevTools MCP
4. Si hay issues, debuggear directamente en el sitio live
```

### Post-deploy rápido

1. `validate-learning-modes.md` → Checklist rápido (sección final)
2. `validate-modals.md` → Checklist rápido (sección final)
3. `automated-offline-test.md` → Tests 1, 3, 6

### Regresión completa

Ejecutar los 3 scripts completos en orden:
1. Learning modes (funcionalidad core)
2. Modals (UI/UX)
3. Offline (PWA/cache)

## Artifacts

### Convención de nombres

```
{categoria}-{numero}-{descripcion}.{extension}
```

Categorías: `offline-`, `edge-`, `perf-`, `network-`, `issue-`, `visual-`

### Tipos

| Extensión | Herramienta MCP | Uso |
|-----------|----------------|-----|
| `.png` | `take_screenshot` | Capturas visuales |
| `.txt` | `take_snapshot` | DOM a11y tree con UIDs |
| `.json` | `performance_stop_trace` | Performance traces |

### Limpieza

```bash
# Eliminar artifacts (mantener docs)
find scripts/devtools -type f \( -name '*.png' -o -name '*.txt' -o -name '*.json' \) -delete
```

## Offline Testing - Edge Cases

### Next-module offline
- El cálculo requiere datos de módulos que pueden no estar cacheados
- Verificar que `getNextRecommendedModule()` funciona con datos cacheados

### Scroll automático a next-module
- Puede fallar si el módulo no está renderizado aún
- Verificar timing de `scrollToNextModule` en `MainMenu.tsx`

### Next-module con prerequisites
- Módulos bloqueados no deben aparecer como next
- Verificar `isModuleUnlocked()` offline

### Persistencia del progreso
- Zustand persist middleware debe funcionar offline
- Verificar localStorage después de completar módulos

## Debugging

### Console / localStorage / Service Worker

```javascript
// Estado de progresión
const state = JSON.parse(localStorage.getItem('fluentflow-progress'));

// Service Worker
const reg = await navigator.serviceWorker.getRegistration();
console.log({ active: !!reg?.active, waiting: !!reg?.waiting });

// Cache storage
const names = await caches.keys();
caches.open('fluentflow-v1').then(c => c.keys().then(console.log));
```

### Troubleshooting

| Problema | Solución |
|----------|----------|
| Chrome no conecta | Verificar `lsof -i :9222`, reiniciar Chrome con `--remote-debugging-port=9222` |
| Service Worker no registra | `curl -I https://gsphome.github.io/englishgame6/service-worker.js` |
| Módulos no se cachean | Revisar estrategia de cache en `service-worker.js` |
| Next-module no actualiza | Verificar `useProgression.ts` (`refetchOnMount: true`) |

## Archivos clave

| Archivo | Responsabilidad |
|---------|----------------|
| `src/services/progressionService.ts` | Lógica de progresión y next-module |
| `src/hooks/useProgression.ts` | Hook con `getNextRecommendedModule()` |
| `src/components/ui/MainMenu.tsx` | Scroll automático a next-module |
| `src/components/ui/ModuleCard.tsx` | Renderizado de next-module destacado |
| `public/service-worker.js` | Cache de módulos JSON |
