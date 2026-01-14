# Використовуємо Node 20 на Alpine
FROM node:20-alpine

# Встановлюємо пакети для складання залежностей (Vite іноді вимагає)
RUN apk add --no-cache python3 make g++

# Робоча директорія у контейнері
WORKDIR /app

# Копіюємо package.json та yarn.lock
COPY package.json yarn.lock ./

# Встановлюємо залежності
RUN yarn install --frozen-lockfile

# Копіюємо весь код проекту
COPY . .

# Збираємо React-застосунок (Vite)
RUN yarn build

# Встановлюємо serve для віддачі збірки
RUN yarn global add serve

# Відкриваємо порт усередині контейнера
EXPOSE 5173

# Команда запуску контейнера
# Добавляємо флаг -H 0.0.0.0, щоб "serve" слухав на всіх інтерфейсах
CMD ["serve", "-s", "dist", "-l", "5173", "-H", "0.0.0.0"]
