# Використовуємо офіційний Node образ
FROM node:20-alpine

# Встановлюємо build tools для нативних модулів (на всяк випадок)
RUN apk add --no-cache python3 make g++

# Робоча директорія у контейнері
WORKDIR /app

# Встановлюємо Corepack і pnpm
RUN corepack enable \
    && corepack prepare pnpm@10.29.3 --activate

# Копіюємо ТІЛЬКИ файли залежностей (для кешування)
COPY package.json pnpm-lock.yaml ./

# Встановлюємо залежності
RUN pnpm install --frozen-lockfile

# Тепер копіюємо решту коду
COPY . .

# Відкриваємо порт сервера
EXPOSE 4000

# Команда запуску сервера
CMD ["node", "bin/www.js"]