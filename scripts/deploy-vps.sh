#!/bin/bash

# Деплой скрипт для VPS
# Использование: ./scripts/deploy-vps.sh

echo "=========================================="
echo "  Начало деплоя на VPS"
echo "=========================================="
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка что мы в директории проекта
if [ ! -f "package.json" ]; then
    echo -e "${RED}Ошибка: Не найден package.json${NC}"
    echo "Пожалуйста, запустите этот скрипт из корневой директории проекта"
    exit 1
fi

# Pull изменений из GitHub
echo -e "${YELLOW}[1/4] Pull изменений из GitHub...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка: Не удалось pull изменения${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Изменения успешно получены${NC}"
echo ""

# Установка production зависимостей
echo -e "${YELLOW}[2/4] Установка production зависимостей...${NC}"
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка: Не удалось установить зависимости${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Зависимости успешно установлены${NC}"
echo ""

# Build проекта
echo -e "${YELLOW}[3/4] Build проекта...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка: Не удалось собрать проект${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Проект успешно собран${NC}"
echo ""

# Перезапуск PM2
echo -e "${YELLOW}[4/4] Перезапуск PM2...${NC}"
pm2 restart hytaleservers
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка: Не удалось перезапустить PM2${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PM2 успешно перезапущен${NC}"
echo ""

# Проверка статуса PM2
echo "=========================================="
echo "  Статус PM2"
echo "=========================================="
pm2 status
echo ""

# Проверка логов
echo "=========================================="
echo "  Последние 10 строк логов"
echo "=========================================="
pm2 logs hytaleservers --lines 10 --nostream
echo ""

echo "=========================================="
echo -e "${GREEN}✓ Деплой успешно завершен!${NC}"
echo "=========================================="
echo ""
echo "Приложение доступно по адресу: http://localhost:3003"
echo "Логи: pm2 logs hytaleservers"
echo "Статус: pm2 status"
echo ""
