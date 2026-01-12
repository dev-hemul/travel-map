# Використовуємо офіційний Node образ
FROM node:20-alpine

# Робоча директорія у контейнері
WORKDIR /app

# Копіюємо залежності
COPY package.json yarn.lock ./

# Встановлюємо залежності через yarn
RUN yarn install --frozen-lockfile

# Копіюємо весь код проекту
COPY . .

# Відкриваємо порт для сервера
EXPOSE 4000

# Старт сервера
CMD ["yarn", "start"]
