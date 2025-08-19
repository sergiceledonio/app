# Endpoints de Pagos - API Backend

## Base URL
```
http://localhost:3000/payments
```

## Endpoints Disponibles

### 1. Pagos

#### GET /payments
Obtiene todos los pagos

**Respuesta:**
```json
[
  {
    "id": 1,
    "amount": 120.00,
    "method": "paypal",
    "status": "completed",
    "description": "Pago por festival",
    "reference": "REF567890",
    "date": "2024-04-02T16:00:00Z",
    "userId": 22,
    "eventId": 14
  }
]
```

#### POST /payments/get-payment
Obtiene un pago por ID

**Body:**
```json
{
  "id": 1
}
```

#### POST /payments/get-payments-by-user
Obtiene pagos por usuario

**Body:**
```json
{
  "id": 22,
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T23:59:59Z"
}
```

#### POST /payments/get-payments-by-event
Obtiene pagos por evento

**Body:**
```json
{
  "id": 14,
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T23:59:59Z"
}
```

#### POST /payments/create-payment
Crea un nuevo pago

**Body:**
```json
{
  "amount": 120.00,
  "method": "paypal",
  "status": "completed",
  "description": "Pago por festival",
  "reference": "REF567890",
  "date": "2024-04-02T16:00:00Z",
  "userId": 22,
  "eventId": 14
}
```

#### PUT /payments/edit-payment
Actualiza un pago existente

**Body:**
```json
{
  "id": 1,
  "payment": {
    "amount": 150.00,
    "method": "paypal",
    "status": "completed",
    "description": "Pago actualizado por festival",
    "reference": "REF567890",
    "date": "2024-04-02T16:00:00Z",
    "userId": 22,
    "eventId": 14
  }
}
```

#### DELETE /payments/delete-payment
Elimina un pago

**Body:**
```json
{
  "id": 1
}
```

## Tipos de Datos

### Transaccion (Payment)
```typescript
interface Transaccion {
  id?: number;
  amount: number;
  method: string;
  status: string;
  description: string;
  reference: string;
  date: string;
  userId: number;
  eventId: number;
}
```

### FindOneParams
```typescript
interface FindOneParams {
  id: number;
  fromDate?: string;
  toDate?: string;
}
```

### SavePaymentDto
```typescript
interface SavePaymentDto {
  amount: number;
  method: string;
  status: string;
  description: string;
  reference: string;
  date: string;
  userId: number;
  eventId: number;
}
```

## Códigos de Estado HTTP

- `200`: OK - Operación exitosa
- `201`: Created - Recurso creado exitosamente
- `400`: Bad Request - Datos inválidos
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor

## Manejo de Errores

Todos los endpoints deben devolver errores en el siguiente formato:

```json
{
  "error": "Mensaje de error descriptivo",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```
