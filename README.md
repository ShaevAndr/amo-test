# AmoCRM Integration Service

Документация создана ИИ. Для работы используется долгосрочный токен, который записывается в env файл в переменную AMO_ACCESS_TOKEN. Дальше всё автоматически и достаточно запустить сборку.

Возникли проблемы с ngrok, отказался работать с моего адреса, поэтому не добавлял работу с токенами авторизации.

Сервис интеграции с AmoCRM для автоматического создания и синхронизации контактов и сделок.

## 🏗️ Архитектура

Проект построен на современном стеке технологий:

- **Backend**: Node.js + TypeScript + Express.js
- **База данных**: MySQL 8.0 + Drizzle ORM
- **DI контейнер**: Inversify
- **Валидация**: Zod
- **Контейнеризация**: Docker + Docker Compose
- **Прокси-сервер**: Nginx

## 📁 Структура проекта

```
amo_test/
├── backend/                 # Backend приложение
│   ├── src/
│   │   ├── config/         # Конфигурация (Inversify, env)
│   │   ├── controllers/    # Контроллеры (Contact, Lead, AmoCRM)
│   │   ├── services/       # Бизнес-логика
│   │   ├── repositories/   # Слой доступа к данным
│   │   ├── models/         # Модели данных
│   │   ├── database/       # Схема БД и миграции
│   │   └── main.ts         # Точка входа
│   ├── Dockerfile          # Docker образ для backend
│   ├── start.sh            # Скрипт запуска с миграциями
│   └── paths.js            # Разрешение алиасов TypeScript
├── nginx/                   # Nginx конфигурация
├── docker-compose.yml       # Оркестрация сервисов
└── hooks.rest              # Тестовые запросы для webhook'ов
```

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose

### 1. Клонирование и настройка

```bash
git clone https://github.com/ShaevAndr/amo-test.git
cd amo_test
```

### 2. Создание .env файла

Создайте файл `.env` в корне проекта:

```env
# База данных
DB_HOST=localhost
DB_HOST_DOCKER=db
DB_PORT=3306
DB_USER=amo_user
DB_PASSWORD=amo_password
DB_NAME=amo_db
MYSQL_ROOT_PASSWORD=root_password

# Сервер
PORT=3000
SERVER_URL=http://localhost

# AmoCRM
AMO_CLIENT_ID=your_client_id
AMO_CLIENT_SECRET=your_client_secret
AMO_REDIRECT_URI=http://localhost/oauth/callback
AMO_DOMAIN=your_domain.amocrm.ru
AMO_ACCESS_TOKEN=your_long_lived_token
```

### 3. Запуск через Docker Compose

```bash
# Сборка и запуск всех сервисов
docker compose up --build

# Запуск в фоновом режиме
docker compose up -d --build

# Просмотр логов
docker compose logs -f backend
```

````

## 🛠️ Локальная разработка

### Установка зависимостей

```bash
cd backend
npm install
````

### Настройка базы данных

```bash
# Создание таблиц
npm run migrate

# Или через Drizzle Kit
npx drizzle-kit migrate
```

### Запуск в режиме разработки

```bash
# Запуск с hot reload
npm run dev

# Сборка и запуск
npm run build
npm start
```

## 📊 API Endpoints

### Контакты

- `POST /api/contacts` - Создание контакта
- `GET /api/contacts/:id` - Получение контакта по ID
- `PUT /api/contacts/:id` - Обновление контакта

### Сделки

- `POST /api/leads` - Создание сделки
- `GET /api/leads/:id` - Получение сделки по ID
- `PUT /api/leads/:id` - Обновление сделки

### Webhook'и AmoCRM

- `POST /api/amo/webhooks/contact/added` - Создание контакта в AmoCRM
- `POST /api/amo/webhooks/contact/updated` - Обновление контакта в AmoCRM
- `POST /api/amo/webhooks/lead/added` - Создание сделки в AmoCRM
- `POST /api/amo/webhooks/lead/updated` - Обновление сделки в AmoCRM

## 🔄 Логика работы

### Создание контакта/сделки

1. **Проверка в локальной БД** - поиск по уникальным полям
2. **Проверка в AmoCRM** - поиск по соответствующим критериям
3. **Создание в AmoCRM** - если не найден
4. **Сохранение в локальную БД** - с ID из AmoCRM

### Обработка webhook'ов

- **Добавление**: Создание новой сущности в локальной БД
- **Обновление**: Обновление существующей сущности или создание новой

## 🗄️ База данных

### Схема

- **contacts**: Контакты (id, amocrm_id, name, phone, created_at, updated_at)
- **leads**: Сделки (id, amocrm_id, name, status, contact_id, created_at, updated_at)

### Миграции

```bash
# Создание новой миграции
npx drizzle-kit generate

# Применение миграций
npx drizzle-kit migrate

# Просмотр схемы
npx drizzle-kit studio
```

## 🐳 Docker

### Сервисы

- **db**: MySQL 8.0 с health check
- **backend**: Node.js приложение с автоматическими миграциями
- **nginx**: Прокси-сервер для маршрутизации

### Полезные команды

```bash
# Пересборка конкретного сервиса
docker compose build backend

# Перезапуск сервиса
docker compose restart backend

# Просмотр логов конкретного сервиса
docker compose logs backend

# Остановка и очистка
docker compose down --volumes --remove-orphans
```

## 🔧 Конфигурация

### TypeScript

- `tsconfig.json` - настройки компиляции
- `paths.js` - разрешение алиасов в runtime
- `prettierrc` - форматирование кода

### Inversify

- `inversify.config.ts` - конфигурация DI контейнера
- `inversifyTypes.ts` - типы для инъекции зависимостей

## 🧪 Тестирование

### Webhook'и

Используйте файл `hooks.rest` для тестирования webhook'ов:

```bash
# Установка REST Client в VS Code
# Или использование curl для имитации webhook'ов
```

### Примеры запросов

```bash
# Создание контакта
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван Иванов","phone":"+79001234567"}'

# Имитация webhook'а создания контакта
curl -X POST http://localhost:3000/api/amo/webhooks/contact/added \
  -H "Content-Type: application/json" \
  -d '{"contacts":{"add":[{"id":123,"name":"Иван","custom_fields_values":[{"values":[{"value":"+79001234567"}]}]}]}}'
```

## 🚨 Устранение неполадок

### Проблемы с Docker

```bash
# Очистка Docker кэша
docker system prune -f

# Пересборка без кэша
docker compose build --no-cache
```

````

### Проблемы с AmoCRM

- Проверьте валидность `AMO_ACCESS_TOKEN`
- Убедитесь в правильности `AMO_DOMAIN`
- Проверьте права доступа к API

## 📝 Логирование

- **Backend**: Логи в stdout/stderr (видно через `docker compose logs`)
- **База данных**: Логи MySQL в stdout
- **Nginx**: Логи доступа и ошибок

## 🔒 Безопасность

- Все переменные окружения хранятся в `.env` файле
- `.env` добавлен в `.gitignore`
- Используется валидация через Zod
- CORS настройки в Express.js

## 🤝 Разработка

### Добавление новых сущностей

1. Создать модель в `src/models/`
2. Создать схему в `src/database/schema.ts`
3. Создать репозиторий в `src/repositories/`
4. Создать сервис в `src/services/`
5. Создать контроллер в `src/controllers/`
6. Добавить в DI контейнер

### Code Style

```bash
# Форматирование кода
npm run format

# Проверка форматирования
npm run format:check
````

## 📚 Дополнительные ресурсы

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Inversify Documentation](https://inversify.io/)
- [AmoCRM API Documentation](https://www.amocrm.ru/developers)
- [Express.js Documentation](https://expressjs.com/)
