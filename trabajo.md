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
  * **Solución**: He organizado el proyecto en las siguientes carpetas para separar bien los componentes:
    * `frontend/`: Código HTML y JS de la aplicación.
    * `backend/`: Servidor API básico hecho con Node.js nativo.
    * `infraestructura/`: Archivos Terraform (`.tf`) y sus scripts.
    * `documentacion/`: Guías en Markdown (como `API.md`).

Parte 2 — Selective execution
* **Configurar workflows que:**
  * **Detecten cambios relevantes**: Usé `dorny/paths-filter@v3` en el orquestador `.github/workflows/ci.yml` para saber en qué carpetas hay cambios.
  * **Ejecuten solo pipelines necesarios**: Puse condicionales `if` en cada job para que solo corra si su carpeta respectiva cambió (`== 'true'`).
  * **Ignoren cambios documentación cuando proceda**: Si solo se editan Markdown en `documentacion/`, no se gasta tiempo de runner pesado y se aprueba solo automáticamente.
  * **Evidencia (Ejecución Selectiva)**:
    Aquí se ve que al modificar solo un archivo, los otros pipelines se saltan (aparecen en blanco con `Skipped`):
    ![Ejecución Selectiva - Saltando jobs](documentacion/images/captura3.png)

Parte 3 — Optimización
* **Reducir:**
  * **Tiempo de ejecución**: Configuré la caché de npm (`cache: 'npm'`) y decidí utilizar el test runner nativo de Node.js (`node --test`) para no bajar frameworks pesados. Los tests corren en menos de **1 segundo**.
  * **Duplicación lógica**: Junté el setup repetitivo en una composite action y creé workflows que se pueden reutilizar.
  * **Uso de runners**: Al saltarse los jobs no modificados, no malgastamos runners de la empresa.

Parte 4 — Reutilización
* **Implementar:**
  * **Reusable workflows**: Creé `.github/workflows/reusable-pipeline.yml` (para frontend y backend) y `.github/workflows/reusable-infra.yml` (para Terraform).
  * **Composite Action**: Hice una acción local en `.github/actions/setup-node-env/action.yml` para configurar Node y la caché de dependencias en un solo paso reutilizable.

Parte 5 — Reporting
* **Generar resumen final:**
  * **Resumen en Markdown**: Creé el job `reporting-pipeline` en `.github/workflows/ci.yml` que corre al final (`if: always()`). Genera una tabla de resumen en el **Job Summary** de GitHub indicando los estados de cada componente.
  * **Evidencia del Resumen generado**:
    ![Tabla Resumen de Ejecución](documentacion/images/captura2.png)
  * **Evidencia de Ejecución Completa (Todo en verde)**:
    Aquí se ve la ejecución cuando se modifican todos los archivos en paralelo y todos los checks pasan correctamente:
    ![Todos los pipelines en verde](documentacion/images/captura1.png)


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
