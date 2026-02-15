# Використовуємо офіційний Node образ
FROM node:20-alpine

# Робоча директорія у контейнері
WORKDIR /app

# Встановлюємо Corepack і pnpm (щоб бути впевненим у версії)
RUN corepack enable \
    && corepack prepare pnpm@10.29.3 --activate

# Копіюємо package.json та pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Встановлюємо залежності
RUN pnpm install --frozen-lockfile

# Копіюємо весь код проекту
COPY . .

# Відкриваємо порт сервера
EXPOSE 4000

# Команда запуску сервера
CMD ["node", "bin/www.js"]
