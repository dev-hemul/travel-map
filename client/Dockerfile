# Використовуємо Node 20 на Alpine
FROM node:20-alpine

# Встановлюємо пакети для складання залежностей (Vite іноді вимагає)
RUN apk add --no-cache python3 make g++

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

# Збираємо React-застосунок (Vite)
RUN pnpm build

# Встановлюємо serve для віддачі збірки
RUN pnpm add -g serve

# Відкриваємо порт усередині контейнера
EXPOSE 5173

# Команда запуску контейнера
CMD ["serve", "-s", "dist", "-p", "5173"]
