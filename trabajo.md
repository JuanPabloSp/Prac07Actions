Laboratorio 7 — Optimización y pipelines monorepo
Momento recomendado
Después del Día 8.
Objetivos
Practicar:
•	Optimización
•	selective execution
•	paths filters
•	performance
•	monorepos
•	workflows complejos

Escenario
La empresa trabaja con un monorepo que contiene:
•	frontend
•	backend
•	infraestructura
•	documentación
No quieren ejecutar todos los pipelines siempre.

Requisitos
Parte 1 — Estructura monorepo
* **Crear estructura con múltiples componentes.**
  * **Solución**: Se ha diseñado un monorepo modular e integrado con las siguientes carpetas específicas:
    * [`frontend/`](file:///c:/Users/ADM/Downloads/LAB7/frontend): Aplicación de cliente SPA construida con Vanilla JS/HTML5.
    * [`backend/`](file:///c:/Users/ADM/Downloads/LAB7/backend): API de servicio REST ligera basada en módulos HTTP nativos.
    * [`infraestructura/`](file:///c:/Users/ADM/Downloads/LAB7/infraestructura): Archivos Terraform (.tf) y scripts de análisis estático de configuración.
    * [`documentacion/`](file:///c:/Users/ADM/Downloads/LAB7/documentacion): Guías arquitectónicas y especificación de endpoints en archivos Markdown.

Parte 2 — Selective execution
* **Configurar workflows que:**
  * **Detecten cambios relevantes**: Mediante el uso del orquestador principal [`ci.yml`](file:///c:/Users/ADM/Downloads/LAB7/.github/workflows/ci.yml) implementado con la acción `dorny/paths-filter@v3`, que rastrea cambios exactos en las carpetas `frontend/**`, `backend/**`, `infraestructura/**` y `documentacion/**`.
  * **Ejecuten solo pipelines necesarios**: Los workflows de `frontend`, `backend` y `infraestructura` se encuentran condicionados individualmente con cláusulas `if` que evalúan las salidas del job de detección de rutas (`if: needs.detect-changes.outputs.<componente> == 'true'`).
  * **Ignoren cambios documentación cuando proceda**: Si solo se detectan cambios en `documentacion/**`, no se inicializa ningún runner de testing o construcción pesado de software, previniendo el consumo inútil de recursos. En el reporte final, estos cambios se catalogan y se marcan como `✅ Auto-approved`.

Parte 3 — Optimización
* **Reducir:**
  * **Tiempo de ejecución**: Configuración de caché de dependencias npm basada en el hash de los archivos `package.json` de cada subcomponente. Además, se utiliza el **Node.js Native Test Runner** (`node --test`), eliminando descargas lentas de frameworks externos pesados de testing y acelerando el arranque de las pruebas unitarias a menos de **1 segundo**.
  * **Duplicación lógica**: Centralización de tareas comunes en acciones locales reutilizables y workflows parametrizados.
  * **Uso innecesario de runners**: Asegurado al 100% mediante la ejecución selectiva (sólo ejecuta los pipelines cuyos archivos han cambiado en el commit o pull request actual).

Parte 4 — Reutilización
* **Implementar:**
  * **Reusable workflows**: Creación de workflows reutilizables parametrizados en [`.github/workflows/reusable-pipeline.yml`](file:///c:/Users/ADM/Downloads/LAB7/.github/workflows/reusable-pipeline.yml) (usado por frontend y backend) y [`.github/workflows/reusable-infra.yml`](file:///c:/Users/ADM/Downloads/LAB7/.github/workflows/reusable-infra.yml) (usado por infraestructura).
  * **Acciones compuestas locales**: Creación de una Composite Action en [`.github/actions/setup-node-env/action.yml`](file:///c:/Users/ADM/Downloads/LAB7/.github/actions/setup-node-env/action.yml) que abstrae y unifica la instalación de Node.js y la gestión inteligente de caché de dependencias en una sola directiva DRY.

Parte 5 — Reporting
* **Generar resumen final:**
  * **Componentes afectados / Pipelines ejecutados / Jobs omitidos**: Implementado con el job `reporting-pipeline` en [`ci.yml`](file:///c:/Users/ADM/Downloads/LAB7/.github/workflows/ci.yml#L64), configurado para ejecutarse de forma mandatoria al finalizar (`if: always()`). Este job recopila en tiempo real los resultados de todas las etapas anteriores y construye una tabla en formato Markdown en el **Job Summary** interactivo de GitHub, dando visibilidad total sobre qué componentes cambiaron, cuáles corrieron exitosamente y cuáles fueron omitidos de forma optimizada (`Skipped`).


Restricciones
•	No lanzar pipelines globales innecesarios
•	Debe existir lógica condicional real
•	Debe justificarse la optimización realizada

Entregables
•	Monorepo funcional
•	Workflows optimizados
•	Explicación decisiones performance
•	Evidencia selective execution

Dificultades esperadas
•	Paths filters
•	Conditions complejas
•	Dependencias entre workflows
•	Lógica monorepo
