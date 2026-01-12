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

# Сборка React-застосунку
RUN yarn build

# Встановлюємо serve для віддачі сборки
RUN yarn global add serve

# Запуск застосунку на порту 5173
CMD ["serve", "-s", "build", "-l", "5173"]

# Відкриваємо порт усередині контейнера
EXPOSE 5173