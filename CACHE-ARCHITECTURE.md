# Arquitectura de Cache

Este documento describe los tres niveles de cache implementados en FluentFlow.

## Niveles de Cache

### 1. Memory Cache (ApiService)

**Ubicación**: `src/services/api.ts` - `ApiService.cache`

**Características**:
- TTL: 5 minutos
- Almacenamiento: Map en memoria
- Scope: Solo durante la sesión activa
- Se pierde: Al recargar la página

**Propósito**: 
Proporcionar respuestas instantáneas para peticiones repetidas durante la misma sesión, evitando llamadas de red innecesarias.

**Ejemplo**:
```typescript
// Primera llamada: va a la red
await apiService.fetchModules(); // ~200ms

// Segunda llamada (dentro de 5 min): desde memoria
await apiService.fetchModules(); // ~1ms
```

### 2. React Query Cache (TanStack Query)

**Ubicación**: `src/hooks/useModuleData.ts`

**Características**:
- staleTime: 10-15 minutos
- Gestión automática de estado
- Deduplicación de queries
- Refetch automático en condiciones específicas

**Propósito**:
Gestionar el estado de las queries, evitar peticiones duplicadas simultáneas, y proporcionar datos mientras se revalidan en background.

**Configuración**:
```typescript
useQuery({
  queryKey: ['module', moduleId],
  staleTime: 10 * 60 * 1000, // 10 minutos
  networkMode: 'always', // Permite queries offline
  refetchOnWindowFocus: false,
})
```

### 3. Persistent Cache (Service Worker + Cache API)

**Ubicación**: `public/sw.js` + `src/services/offlineManager.ts`

**Características**:
- TTL: Indefinido (controlado por versión de cache)
- Almacenamiento: Cache API del navegador
- Scope: Persistente entre sesiones
- Sobrevive: Recargas de página, cierre del navegador

**Propósito**:
Habilitar modo offline completo, permitiendo que la app funcione sin conexión a internet.

**Estrategias por tipo de recurso**:

#### Data JSON (learningModules.json, módulos)
- **Estrategia**: Network-first con fallback a cache
- **Cache**: `fluentflow-offline-v5`
- **Flujo**:
  1. Intenta fetch de red
  2. Si éxito: actualiza cache y retorna
  3. Si falla: busca en cache con múltiples estrategias de matching
  4. Si no hay cache: retorna error 503

#### Assets JS/CSS
- **Estrategia**: Cache-first (inmutables por hash)
- **Cache**: `fluentflow-assets-v6`
- **Flujo**:
  1. Busca en cache
  2. Si existe: retorna inmediatamente
  3. Si no existe: fetch de red y cachea

#### HTML
- **Estrategia**: Network-first con fallback a cache
- **Cache**: `fluentflow-assets-v6`

## Flujo de Datos Completo

### Escenario Online

```
Usuario solicita módulo
    ↓
React Query verifica cache (staleTime)
    ↓
Si stale → ApiService.fetchModuleData()
    ↓
ApiService verifica Memory Cache (5 min TTL)
    ↓
Si no hay → fetch() de red
    ↓
Service Worker intercepta
    ↓
Intenta red → Éxito
    ↓
SW actualiza Cache API
    ↓
Respuesta → ApiService actualiza Memory Cache
    ↓
React Query actualiza su cache
    ↓
Componente recibe datos
```

### Escenario Offline

```
Usuario solicita módulo (sin red)
    ↓
React Query verifica cache (staleTime)
    ↓
Si stale → ApiService.fetchModuleData()
    ↓
ApiService verifica Memory Cache (5 min TTL)
    ↓
Si no hay → fetch() de red
    ↓
Service Worker intercepta
    ↓
Intenta red → Falla (offline)
    ↓
SW busca en Cache API
    ↓
Si existe → Retorna desde cache
    ↓
ApiService actualiza Memory Cache
    ↓
React Query actualiza su cache
    ↓
Componente recibe datos
```

## Gestión de Modo Offline

### Descarga de Contenido

El usuario puede descargar niveles específicos para uso offline:

```typescript
// En CompactAdvancedSettings.tsx
await downloadLevels(
  selectedLevels,     // ['a1', 'b1']
  onProgress,         // Callback de progreso
  selectedCategories  // ['Vocabulary', 'Grammar']
);
```

**Proceso**:
1. Pre-cachea assets JavaScript críticos
2. Obtiene lista de módulos desde `learningModules.json`
3. Filtra por niveles y categorías seleccionadas
4. Descarga cada archivo JSON secuencialmente con reintentos
5. Almacena en Cache API con múltiples formatos de URL

### Verificación de Integridad

```typescript
const { valid, missingLevels } = await verifyCacheIntegrity(downloadedLevels);
```

Verifica que los niveles descargados sigan disponibles en cache.

## Ventajas de la Arquitectura Multi-Nivel

1. **Performance**: Memory cache proporciona respuestas instantáneas
2. **Eficiencia**: React Query evita peticiones duplicadas
3. **Offline**: Service Worker permite funcionamiento sin red
4. **Resiliencia**: Múltiples fallbacks garantizan disponibilidad
5. **Flexibilidad**: Cada nivel puede configurarse independientemente

## Limpieza de Cache

### Memory Cache
```typescript
apiService.clearCache();
```

### React Query Cache
```typescript
queryClient.clear();
```

### Persistent Cache
```typescript
// Todo el cache offline
await deleteAllCache();

// Solo un nivel específico
await deleteLevelCache('a1');
```

## Debugging

### Ver estado de Memory Cache
```typescript
const stats = apiService.getCacheStats();
console.log(stats); // { size: 5, keys: [...] }
```

### Ver estado de React Query
```typescript
// En DevTools de React Query
```

### Ver estado de Service Worker Cache
```javascript
// En DevTools → Application → Cache Storage
// Buscar: fluentflow-offline-v5, fluentflow-assets-v6
```

## Consideraciones

- **Memory Cache**: Se limpia automáticamente después de 5 minutos
- **React Query**: Gestiona su propio garbage collection
- **SW Cache**: Persiste hasta que se actualice la versión o el usuario lo borre manualmente
- **Versiones**: Al cambiar versión de cache (v5→v6), el SW limpia versiones antiguas automáticamente

## Actualización de Versiones

Cuando se necesita forzar actualización de cache:

1. Incrementar versión en `public/sw.js`:
```javascript
const CACHE_NAME = 'fluentflow-offline-v6';
const ASSETS_CACHE = 'fluentflow-assets-v7';
```

2. Incrementar versión en `src/services/offlineManager.ts`:
```typescript
export const CACHE_NAME = 'fluentflow-offline-v6';
export const ASSETS_CACHE = 'fluentflow-assets-v7';
```

3. El SW automáticamente limpiará versiones antiguas en el evento `activate`.
