# Використовуємо офіційний Node образ
FROM node:20-alpine

# Робоча директорія у контейнері
WORKDIR /app

# Копіюємо package.json та yarn.lock
COPY package.json yarn.lock ./

# Встановлюємо залежності
RUN yarn install --frozen-lockfile

# Копіюємо весь код проекту
COPY . .

# Відкриваємо порт сервера
EXPOSE 4000

# Команда запуску сервера (вказуємо точний шлях до скрипту)
CMD ["node", "bin/www.js"]