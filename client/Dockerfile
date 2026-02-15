# Используем Alpine (намного легче)
FROM node:20-alpine

# Устанавливаем bash (опционально) и build tools
RUN apk add --no-cache python3 make g++ bash

# Настройка PNPM
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
ENV PNPM_HOME="/pnpm-global"
ENV PATH="$PNPM_HOME:$PATH"

# Рабочая директория
WORKDIR /app

# Копируем ТОЛЬКО файлы зависимостей (для кеширования)
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Собираем фронтенд
RUN pnpm build

# Устанавливаем serve глобально
RUN pnpm add -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-p", "5173"]