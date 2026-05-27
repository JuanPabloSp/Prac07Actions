# 📖 Especificación de la API del Monorepo

Este documento detalla los endpoints expuestos por el componente **backend** del monorepo.

## Servidor
* **Puerto de Desarrollo**: `http://localhost:3000`
* **Puerto de Integración (Pruebas)**: `http://localhost:3001`

---

## Endpoints Disponibles

### 1. Obtener Estado del Sistema (`Health Check`)
Permite comprobar la salud general y disponibilidad de la API.

* **URL**: `/api/health`
* **Método**: `GET`
* **Respuestas**:
  * **200 OK**:
    ```json
    {
      "status": "UP",
      "timestamp": "2026-05-27T12:00:00.000Z"
    }
    ```

### 2. Obtener Información de Compilación
Devuelve metadatos sobre el componente, versión y entorno en ejecución.

* **URL**: `/api/info`
* **Método**: `GET`
* **Respuestas**:
  * **200 OK**:
    ```json
    {
      "component": "backend",
      "version": "1.0.0",
      "environment": "development"
    }
    ```

---

## Códigos de Estado Comunes
* `200 OK`: La solicitud ha sido procesada con éxito.
* `404 Not Found`: El recurso solicitado o la ruta no existe.
