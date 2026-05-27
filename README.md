# 🚀 Laboratorio 7 — Optimización y Pipelines Monorepo

Este repositorio contiene la solución completa para el **Laboratorio 7**, enfocada en la creación, reutilización y optimización extrema de flujos de trabajo (pipelines) de CI/CD para una arquitectura de monorepo en **GitHub Actions**.

---

## 🏗️ 1. Estructura del Monorepo

El monorepo está organizado en componentes aislados para evitar la duplicación de responsabilidades y permitir la compilación y despliegue modular:

```text
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Orquestador principal (detecta cambios y decide qué correr)
│   │   ├── reusable-pipeline.yml  # Workflow reutilizable para Node (Build, Lint, Test)
│   │   └── reusable-infra.yml     # Workflow reutilizable para Infraestructura (Terraform)
│   └── actions/
│       └── setup-node-env/
│           └── action.yml         # Acción compuesta para configurar Node con caché global de npm
├── frontend/                      # SPA Estática (HTML5 / Vanilla JS)
│   ├── src/                       # Código fuente y archivos unitarios
│   ├── scripts/                   # Scripts de automatización (lint, build)
│   └── package.json               # Configuración del componente
├── backend/                       # API REST ligera (Módulo HTTP nativo)
│   ├── src/                       # Servidor y pruebas unitarias de endpoints
│   ├── scripts/                   # Scripts de linting y compilación sintáctica
│   └── package.json               # Configuración del componente
├── infraestructura/               # Infraestructura como Código (Simulación Terraform)
│   ├── main.tf                    # Declaración de recursos locales
│   ├── variables.tf / outputs.tf  # Variables y salidas
│   └── scripts/                   # Linter y script de análisis de seguridad personalizado
└── documentacion/                 # Guías del sistema en formato Markdown
    ├── API.md                     # Contrato e información de endpoints
    └── architecture.md            # Diagrama de arquitectura del monorepo
```

---

## ⚡ 2. Ejecución Selectiva (Selective Execution)

Para evitar la ejecución de pipelines globales innecesarios (por ejemplo, ejecutar tests del backend cuando solo cambió el HTML del frontend), implementamos una estrategia de **Detección de Rutas** mediante la acción `dorny/paths-filter`.

### Lógica de Disparo:
El orquestador principal [`.github/workflows/ci.yml`](.github/workflows/ci.yml) actúa como el único punto de entrada de integración continua. Este detecta cambios en las siguientes rutas en cada *push* o *pull request*:

* **Frontend**: `frontend/**`
* **Backend**: `backend/**`
* **Infraestructura**: `infraestructura/**`
* **Documentación**: `documentacion/**`

Si solo hay modificaciones en la carpeta `documentacion/` o archivos `.md` raíz, el pipeline **omite por completo** los runners de construcción de software pesados, protegiendo los runners de la empresa.

---

## ⚙️ 3. Reutilización de Lógica (DRY)

Hemos minimizado la duplicación de código en los flujos de trabajo utilizando dos herramientas clave de GitHub Actions:

### A. Acción Compuesta (`Composite Action`)
Ubicada en [`.github/actions/setup-node-env/action.yml`](.github/actions/setup-node-env/action.yml), encapsula las siguientes tareas repetitivas en una única llamada:
1. Configuración de la versión adecuada de Node.js.
2. Configuración e inicialización del mecanismo de caché global de `npm` guiada por el archivo `package.json` del componente específico.
3. Diagnóstico e impresión de versiones del entorno.

### B. Workflows Reutilizables (`Reusable Workflows`)
* **[`reusable-pipeline.yml`](.github/workflows/reusable-pipeline.yml)**: Recibe parámetros como `component-name` y `working-directory` para ejecutar de manera uniforme la secuencia de calidad: **Lint ➡️ Test ➡️ Build**. Es utilizado en paralelo tanto por el Frontend como por el Backend.
* **[`reusable-infra.yml`](.github/workflows/reusable-infra.yml)**: Automatiza las tareas de infraestructura mediante chequeos automáticos de formato (`terraform fmt`) y un análisis estático de seguridad en los scripts.

---

## 📈 4. Decisiones de Optimización y Rendimiento (Performance)

La solución ha sido optimizada bajo las siguientes métricas de ingeniería:

| Estrategia de Optimización | Implementación Técnica | Justificación de Rendimiento |
| :--- | :--- | :--- |
| **Pruebas sin Dependencias** | Uso del **Node.js Native Test Runner** (`node --test`) | Evita descargar frameworks pesados como Jest o Mocha, eliminando el tiempo de descarga (`npm install` tarda **0 segundos**). |
| **Caché Global Inteligente** | `actions/setup-node` con `cache: 'npm'` | Reutiliza dependencias previamente resueltas, acelerando la inicialización en caso de incorporar dependencias futuras. |
| **Paralelización Concurrente** | Jobs paralelos en el orquestador sin acoplamiento | Frontend, Backend e Infraestructura se ejecutan simultáneamente en runners independientes. |
| **Filtrado de Rutas (Selective)** | Condicionales `if` basadas en salidas de `paths-filter` | Reduce el uso de runners a cero para componentes que no han sufrido modificaciones. |

---

## 📊 5. Sistema de Reportes (Reporting)

El orquestador finaliza siempre (`if: always()`) con el job `reporting-pipeline`. Este recopila dinámicamente los estados de las fases previas y los formatea en un **Job Summary** interactivo en Markdown.

El reporte proporciona visibilidad inmediata de:
1. Qué componentes fueron afectados por el commit.
2. Qué pipelines se ejecutaron con éxito.
3. Qué jobs fueron omitidos para ahorrar tiempo y recursos.

---

## 📸 6. Evidencia de Ejecución (Screenshots)

A continuación se presenta la evidencia gráfica de la solución implementada.

### A. Ejecución Selectiva en Acción
Esta captura de pantalla simula una ejecución donde se realizaron cambios **exclusivamente en el Frontend**. Como se puede observar, los pipelines de **Backend** e **Infraestructura** se omiten automáticamente (`Skipped`), ahorrando el 100% de su tiempo de ejecución, mientras que el Frontend se valida con éxito y se compila el reporte de resumen.

![Ejecución Selectiva - Solo Frontend](documentacion/images/selective_execution_evidence.png)

### B. Reporte Automatizado de Resumen (Job Summary)
Esta captura muestra el reporte interactivo generado automáticamente por el pipeline al final de la ejecución, visible en la pestaña de resumen de GitHub Actions. Proporciona una tabla estructurada clara y métricas de optimización.

![Reporte de Resumen del Monorepo](documentacion/images/reporting_summary_evidence.png)

---

## 🛠️ Cómo Probar Localmente

Aunque los pipelines están listos para ejecutarse en la nube de GitHub, puedes simular las validaciones de calidad localmente si tienes Node.js instalado en tu sistema:

```bash
# Validar Frontend
cd frontend
npm run lint
npm run test
npm run build

# Validar Backend
cd ../backend
npm run lint
npm run test
npm run build

# Validar Infraestructura
cd ../infraestructura
node scripts/validate-tf.js
```
