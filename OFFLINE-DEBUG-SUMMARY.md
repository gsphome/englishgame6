# Resumen del Problema Offline

## Estado Actual
- ✅ Service Worker registrado
- ✅ Reading modules funcionan offline
- ❌ Otros tipos (flashcard, quiz, matching, etc.) NO funcionan offline

## Causa Probable
Las URLs que se guardan en cache NO coinciden con las URLs que se piden después.

## Logs Agregados
1. `[UI] Offline state:` - Estado inicial del componente
2. `[UI] Download button clicked` - Click en botón
3. `[UI] handleDownload called` - Inicio proceso
4. `[UI] Differential update:` - Qué descargar/borrar
5. `[OfflineManager] Starting download for levels:` - Inicio descarga
6. `[OfflineManager] URLs to download:` - Cantidad archivos
7. `[OfflineManager] First 3 URLs:` - Primeras 3 URLs
8. `[OfflineManager] Downloading:` - Cada archivo
9. `[OfflineManager] ✅ Cached:` o `❌ Failed:` - Resultado
10. `[SW] Intercepting:` - Service Worker intercepta petición
11. `[SW] Network success:` o `[SW] Network failed` - Resultado red
12. `[SW] ✅ Serving from cache:` - Sirve desde cache
13. `[SW] ❌ Not in cache. Available URLs:` - No encontrado + lista

## Próximos Pasos
1. Abrir https://gsphome.github.io/englishgame6/ en móvil
2. Conectar por USB y abrir chrome://inspect
3. Ir a Settings → Offline Mode
4. Descargar nivel A1
5. Ver logs en DevTools remoto
6. Copiar los logs completos aquí

## Qué Buscar en los Logs
- ¿Se están descargando todos los archivos?
- ¿Qué URLs se guardan en cache?
- ¿Qué URLs se piden cuando estás offline?
- ¿Coinciden exactamente?

## Fix Aplicado
- `pathUtils.ts`: URLs siempre absolutas con `window.location.origin`
- Antes: `/englishgame6/data/...` (relativa)
- Ahora: `https://gsphome.github.io/englishgame6/data/...` (absoluta)
