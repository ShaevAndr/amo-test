# Архитектура AmoCRM Integration Service

## 🏗️ Общая архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Backend API   │    │   MySQL DB      │
│   (Port 80)     │◄──►│   (Port 3000)   │◄──►│   (Port 3306)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
   External Clients         AmoCRM API              Data Storage
   (Web, Mobile)           (Webhooks)              (Contacts, Leads)
```

## 🔄 Поток данных

### 1. Создание контакта/сделки

```
Client Request → Nginx → Backend → Check Local DB → Check AmoCRM → Create in AmoCRM → Save to Local DB → Response
```

### 2. Обработка webhook'ов

```
AmoCRM Event → Webhook → Backend → Process Data → Update/Create Local DB → Response
```

## 🧩 Компоненты системы

### Frontend Layer (Nginx)

- **Роль**: Прокси-сервер, балансировщик нагрузки
- **Функции**:
  - Маршрутизация запросов
  - SSL termination
  - Статические файлы
  - Rate limiting

### Backend Layer (Node.js + Express)

#### Controllers

- **ContactController**: Управление контактами
- **LeadController**: Управление сделками
- **AmoController**: Обработка webhook'ов AmoCRM

#### Services

- **ContactService**: Бизнес-логика контактов
- **LeadService**: Бизнес-логика сделок
- **AmoService**: Интеграция с AmoCRM
- **AmoWebhookService**: Обработка webhook'ов

#### Repositories

- **ContactRepository**: Доступ к данным контактов
- **LeadRepository**: Доступ к данным сделок

#### Models

- **Contact**: Модель контакта
- **Lead**: Модель сделки

### Data Layer

#### Database (MySQL)

- **contacts**: Таблица контактов
- **leads**: Таблица сделок
- **Индексы**: По amocrm_id, phone, name

#### ORM (Drizzle)

- **Схема**: Типобезопасная схема БД
- **Миграции**: Автоматическое управление схемой
- **Query Builder**: Типобезопасные запросы

## 🔌 Интеграции

### AmoCRM API

```typescript
interface AmoTransport {
  getContactByPhone(phone: string): Promise<IContact | null>;
  getLeadByName(name: string): Promise<ILead | null>;
  addContact(contact: CreateContactPayload): Promise<number>;
  addLead(lead: CreateLeadPayload): Promise<number>;
  subscribeHook(hook: HookSubscribe): Promise<void>;
  unsubscribeHook(hook: HookUnsubscribe): Promise<void>;
}
```

### Webhook Processing

```typescript
interface AmoWebhookService {
  processContactAdded(webhookData: AmoContactWebhook): Promise<void>;
  processContactUpdated(webhookData: AmoContactWebhook): Promise<void>;
  processLeadAdded(webhookData: AmoLeadWebhook): Promise<void>;
  processLeadUpdated(webhookData: AmoLeadWebhook): Promise<void>;
}
```

## 🗄️ Схема базы данных

### ER Diagram

```
┌─────────────┐         ┌─────────────┐
│  contacts  │         │    leads    │
├─────────────┤         ├─────────────┤
│ id (PK)    │◄────────┤ contact_id │
│ amocrm_id  │         │ id (PK)    │
│ name       │         │ amocrm_id  │
│ phone      │         │ name       │
│ created_at │         │ status     │
│ updated_at │         │ created_at │
└─────────────┘         │ updated_at │
                        └─────────────┘
```

### Таблица contacts

| Поле       | Тип             | Описание                       |
| ---------- | --------------- | ------------------------------ |
| id         | BIGINT UNSIGNED | Первичный ключ (автоинкремент) |
| amocrm_id  | BIGINT UNSIGNED | ID контакта в AmoCRM           |
| name       | VARCHAR(255)    | Имя контакта                   |
| phone      | VARCHAR(20)     | Номер телефона                 |
| created_at | TIMESTAMP       | Дата создания                  |
| updated_at | TIMESTAMP       | Дата обновления                |

### Таблица leads

| Поле       | Тип             | Описание                       |
| ---------- | --------------- | ------------------------------ |
| id         | BIGINT UNSIGNED | Первичный ключ (автоинкремент) |
| amocrm_id  | BIGINT UNSIGNED | ID сделки в AmoCRM             |
| name       | VARCHAR(255)    | Название сделки                |
| status     | VARCHAR(100)    | Статус сделки                  |
| contact_id | BIGINT UNSIGNED | Ссылка на контакт (FK)         |
| created_at | TIMESTAMP       | Дата создания                  |
| updated_at | TIMESTAMP       | Дата обновления                |

## 🔐 Безопасность

### Аутентификация

- **AmoCRM**: Bearer token в заголовке Authorization
- **API**: Валидация через Zod схемы

### Валидация данных

```typescript
// Пример валидации контакта
const ContactCreateSchema = z.object({
  name: z.string().min(1).max(255),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});
```

### Переменные окружения

- Все секретные данные в `.env` файле
- `.env` добавлен в `.gitignore`
- Разные конфигурации для dev/prod

## 🚀 Производительность

### Кэширование

- **База данных**: Индексы по часто используемым полям
- **API**: Connection pooling для MySQL

### Масштабируемость

- **Горизонтальное**: Docker Compose с несколькими backend инстансами
- **Вертикальное**: Увеличение ресурсов контейнеров

### Мониторинг

- **Логи**: Structured logging в stdout/stderr
- **Health checks**: Проверка состояния сервисов
- **Metrics**: Готовность к интеграции с Prometheus

## 🔧 Конфигурация

### Docker Services

```yaml
services:
  db: # MySQL 8.0 с health check
  backend: # Node.js приложение
  nginx: # Прокси-сервер
```

### Environment Variables

```bash
# Обязательные
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
AMO_CLIENT_ID, AMO_CLIENT_SECRET, AMO_DOMAIN, AMO_ACCESS_TOKEN
PORT, SERVER_URL

# Опциональные
NODE_ENV, LOG_LEVEL, JWT_SECRET, SESSION_SECRET
```

## 🧪 Тестирование

### Unit Tests

- **Services**: Мокирование репозиториев
- **Controllers**: Мокирование сервисов
- **Repositories**: Мокирование базы данных

### Integration Tests

- **API Endpoints**: Тестирование полного flow
- **Database**: Тестирование с реальной БД
- **AmoCRM**: Мокирование API вызовов

### E2E Tests

- **Webhook Flow**: От создания до синхронизации
- **Error Handling**: Проверка обработки ошибок

## 📊 Логирование

### Структура логов

```typescript
interface LogEntry {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  service: string;
  message: string;
  metadata?: Record<string, any>;
  error?: Error;
}
```

### Уровни логирования

- **DEBUG**: Детальная информация для разработки
- **INFO**: Общая информация о работе системы
- **WARN**: Предупреждения, не критичные ошибки
- **ERROR**: Критичные ошибки, требующие внимания

## 🔄 CI/CD Pipeline

### Этапы

1. **Build**: Сборка Docker образов
2. **Test**: Запуск unit и integration тестов
3. **Security**: Сканирование уязвимостей
4. **Deploy**: Развертывание в staging/production

### Environments

- **Development**: Локальная разработка
- **Staging**: Тестирование перед продакшеном
- **Production**: Продакшен среда

## 🚨 Disaster Recovery

### Backup Strategy

- **Database**: Ежедневные бэкапы MySQL
- **Configuration**: Версионирование конфигураций
- **Code**: Git репозиторий с тегами релизов

### Recovery Procedures

1. Восстановление базы данных из бэкапа
2. Перезапуск сервисов
3. Проверка синхронизации с AmoCRM
4. Мониторинг ошибок

## 📈 Мониторинг и алерты

### Key Metrics

- **Response Time**: Время ответа API
- **Error Rate**: Процент ошибок
- **Throughput**: Количество запросов в секунду
- **Database Connections**: Активные подключения к БД

### Alerts

- **High Error Rate**: >5% ошибок за 5 минут
- **High Response Time**: >2 секунд
- **Service Down**: Сервис недоступен
- **Database Issues**: Проблемы с подключением к БД
