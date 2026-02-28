# Scripts de Utilidades

Herramientas organizadas por funcionalidad para el mantenimiento y optimización del proyecto.

## Estructura

### 📁 build/
- `security-patterns.js` - Detección de patrones de seguridad peligrosos

### 📁 development/
- `dev-tools.js` - Orquestador de flujo de desarrollo (pipelines quality/security/build)
- `simulate-github-pages.js` - Simulación local de GitHub Pages

### 📁 git/
- `smart-commit.js` - Commits inteligentes
- `github-actions-status.js` - Estado de GitHub Actions
- `validate-pages-deployment.js` - Validación de deployments
- `deployment-status.js` - Estado de deployment

### 📁 validation/
- `validate-all.js` - Validación completa (links + módulos)
- `validate-bem.js` - Validación BEM en TSX
- `validate-design-tokens.js` - Validación de tokens CSS
- `validate-data-paths.js` - Verificación de paths en datos JSON
- `fix-module-types.js` - Corrección de tipos en learningModules.json

### 📁 utils/
- `logger.js` - Sistema de logging
- `git-utils.js` - Operaciones de Git

## Uso Rápido

```bash
# Herramienta unificada
node scripts/tools.js list
node scripts/tools.js status

# Pipelines
npm run pipeline:quality
npm run pipeline:build
npm run pipeline:all

# Git
npm run gh:status
npm run gh:current
npm run gh:watch
```
