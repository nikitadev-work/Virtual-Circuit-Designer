# Bearer Token Authentication

## 1) Register new user
- **Type:** POST  
- **Path:** `/user/register`  
- **Body:** JSON(`name`, `email`, `password`)

### Response:
- **Status:** 
  - `201` - successful
  - `400` - invalid data or already exists

---

## 2) Login user
- **Type:** POST  
- **Path:** `/user/login`  
- **Body:** JSON(`email`, `password`)

### Response:
- **Type:** application/json  
- **Body:** JWT Token  
- **Status:** 
  - `200` - successful
  - `401` - invalid data

---

## 3) Get all circuits
- **Type:** GET  
- **Body:** JSON(`user_id`) - user_id can be extracted from JWT Token  
- **Path:** `/circuits`  
- **Authorization:** JWT Token

### Response:
- **Status:** 
  - `200` - successful
  - `401` - Unauthorized  
- **Body:** all circuits for the given user

---

## 4) Save new circuit
- **Type:** POST  
- **Body:** JSON(`user_id`, `text_representation_of_graph`) - user_id can be extracted from JWT Token  
- **Path:** `/circuits`  
- **Authorization:** JWT Token

### Response:
- **Status:** 
  - `201` - successful
  - `401` - Unauthorized
  - `400` - invalid data

---

## 5) Start simulation
- **Type:** POST  
- **Body:** JSON(`user_id`, `circuit_id`, `input_data`) - user_id can be extracted from JWT Token  
- **Authorization:** JWT Token  
- **Path:** `/circuits/simulate`

### Response:
- **Status:** 
  - `200` - successful
  - `401` - Unauthorized
  - `400` - invalid data  
- **Body:** JSON(`result_data`)

---

## 6) Удаление схемы
- **Type:** DELETE  
- **Path:** `/api/circuits/{id}`  
- **Authorization:** JWT Token

### Response:
- **Status:** 
  - `204` - No Content (успешное удаление)
  - `401` - Unauthorized (неавторизованный доступ)
  - `404` - Not Found (схема с указанным ID не найдена)
  - `400` - Bad Request (неверный ID)

### Пример запроса:
```http
DELETE /api/circuits/12345 HTTP/1.1
Authorization: Bearer {token}

---

## Possible improvements:
- JWT token update logic
- Log out logic

---

# Потоки запросов

## Регистрация (POST /user/register):
1. Клиент отправляет запрос на API Gateway с данными (например, `{"first_name":"John","last_name":"Doe","email":"john@example.com","password":"secret"}`).
2. API Gateway:
   - Отправляет запрос в Database-service для создания пользователя (`/db/users/create`), получая `userID`.
   - Если пользователь успешно создан, отправляет запрос в Auth-service для генерации JWT-токена (`/auth/generate-token`) с `userID`.
   - Возвращает клиенту JWT-токен (например, `{"token":"eyJ..."}`).
   - Если возникает ошибка (например, email уже существует), возвращается ошибка (например, `400 Bad Request`).

## Логин (POST /user/login):
1. Клиент отправляет запрос на API Gateway с данными (например, `{"email":"john@example.com","password":"secret"}`).
2. API Gateway:
   - Отправляет запрос в Database-service для проверки учетных данных (`/db/users/verify`), получая `userID`, если данные верны.
   - Если проверка прошла, отправляет запрос в Auth-service для генерации JWT-токена (`/auth/generate-token`) с `userID`.
   - Возвращает клиенту JWT-токен.
   - Если данные неверны, возвращается ошибка (например, `401 Unauthorized`).
