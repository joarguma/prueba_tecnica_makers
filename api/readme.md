# Pruebas API — Makers Practica

## Resumen

Se evaluaron tres operaciones de ReqRes: creación, consulta por ID y actualización parcial de un usuario. La ejecución analizada contiene **3 solicitudes y 6 tests: 3 aprobados y 3 fallidos**.

La creación y la actualización parcial respondieron según lo esperado. La consulta del usuario creado devolvió 404 porque los endpoints demo no persisten las altas. También falló la validación adicional de tiempo de respuesta del POST.

**Evidencia principal:** `resultado.json`, correspondiente a la colección actualizada `Makers_Practice.postman_collection.json`. El análisis revisa esa ejecución suministrada; no representa una nueva corrida.

## 1. Descargar, importar y ejecutar

1. Descargar la colección `Makers_Practice.postman_collection.json` incluida en la entrega.
2. Abrir Postman y seleccionar **Import**. Elegir el archivo JSON o arrastrarlo a la ventana de importación.
3. Abrir la colección **Makers_Practice** y revisar la pestaña **Variables**.
4. Ejecutar la colección con **Run collection**, una iteración y este orden: **create user → Get User → update name user**.
5. Revisar **Test Results** y las respuestas de cada solicitud. Los scripts están en **Scripts → After response**.

### Variables predefinidas

| Variable | Valor inicial exportado | Uso |
|---|---|---|
| `name` | Test User | Nombre enviado en el POST. |
| `job` | Automation Engineer | Trabajo enviado en el POST y valor esperado por el test del GET. |
| `NewName` | Test User Johan | Nombre utilizado en la actualización parcial. |
| `userId` | 363 | Valor inicial que el POST reemplaza con el ID devuelto antes de ejecutar GET y PATCH. |

No se requiere un archivo de environment para esta versión: las variables están definidas en la colección. Ejecutar solo el GET sin ejecutar primero el POST puede utilizar el ID inicial o uno de una ejecución previa.


## 2. Pruebas implementadas

| Operación | Validaciones y acciones |
|---|---|
| **POST /api/users** | Verifica HTTP 201 y tiempo de respuesta inferior a 200 ms. Extrae el ID recibido y actualiza `userId` para las siguientes solicitudes. |
| **GET /api/users/{id}** | Verifica HTTP 200 e intenta comparar `data.id` y `data.job` con las variables de la colección. |
| **PATCH /api/users/{id}** | Caso adicional: envía únicamente `name`, verifica HTTP 200 y compara el nombre devuelto con `NewName`. |

La extracción del ID es una acción del script, no un séptimo test. La comparación del nombre en el GET, solicitada por el enunciado, todavía no está implementada en la colección.

## 3. Resultados de la ejecución

El POST devolvió el ID **756**. El GET y el PATCH utilizaron ese mismo ID, por lo que la captura y propagación de `userId` funcionaron.

| Solicitud | HTTP obtenido | Tiempo | Tests aprobados | Tests fallidos |
|---|---:|---:|---:|---:|
| create user | 201 | 390 ms | 1 | 1 |
| Get User | 404 | 285 ms | 0 | 2 |
| update name user | 200 | 168 ms | 2 | 0 |
| **Total** | — | — | **3** | **3** |

### Detalle de los fallos

- **Tiempo del POST:** se recibieron 390 ms frente a un umbral inferior a 200 ms. Es una validación adicional de la colección; el enunciado no especifica un SLA. Esta medición individual no equivale a una prueba de carga.
- **Estado del GET:** se esperaba HTTP 200 y se obtuvo HTTP 404 con cuerpo `{}`.
- **Validación de datos del GET:** el script intentó acceder a `responseJson.data.id`, pero `data` no existe en el cuerpo recibido. El test falló con `Cannot read properties of undefined (reading 'id')`; la comparación posterior de `job` no llegó a ejecutarse.

## 4. Diferencias entre el requerimiento y la API demo

### El usuario creado no queda disponible para consulta

El enunciado solicita crear un usuario y consultarlo inmediatamente utilizando su ID. La respuesta del POST analizado incluye `persisted: false`: devuelve los datos enviados y un ID, pero no guarda el usuario para recuperarlo después.

Por ello, el GET de `/api/users/756` devuelve 404. Es una limitación del flujo disponible en la demo respecto del ejercicio, no una falla de la variable ni una demora que se resuelva esperando antes del GET.

El catálogo demo consultado como referencia contiene **12 usuarios predefinidos, con IDs del 1 al 12**, distribuidos en dos páginas. El rango 1–11 deja fuera al usuario con ID 12. Esto describe los datos de ejemplo consultados, no una regla universal para cualquier modalidad de ReqRes.

### El contrato del GET no define el campo job

El esquema `LegacyUser`, referenciado por la respuesta del GET en el contrato OpenAPI, define:

```text
id, email, first_name, last_name, avatar
```

No define `job` ni un campo `name` equivalente al enviado en el POST. Por tanto, consultar un usuario predefinido tampoco permite comprobar que el nombre y trabajo del usuario recién creado se conservaron como solicita el enunciado.

Se identifica una **brecha entre el requerimiento del ejercicio y el contrato/comportamiento del endpoint demo**. La ausencia de `job` en esta respuesta no se presenta como un defecto demostrado de ReqRes.

## 5. Validación adicional de actualización parcial

Se agregó un PATCH enviando únicamente:

```json
{
  "name": "{{NewName}}"
}
```

La API respondió HTTP 200 y devolvió `Test User Johan`, por lo que sus dos tests aprobaron. Esto valida la respuesta del PATCH; no demuestra persistencia del cambio para una consulta posterior en la demo.

El título del test de estado del PATCH todavía dice **“Status code is 201”**, aunque su aserción valida correctamente **200**. Conviene ajustar el título para evitar una lectura incorrecta del reporte.