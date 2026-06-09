#!/usr/bin/env bash
set -e
cd /opt/cbk-server

# --- 1. Обновление исходников и сборка ---
echo "=== git pull ==="
git pull
echo "=== npm run build ==="
npm run build
cp -r proto dist/proto   # если ещё не добавлено в package.json build script

# --- 2. Проверка, существует ли процесс cbk-server в pm2 ---
if pm2 list | grep -q "cbk-server"; then
    echo "Процесс cbk-server уже запущен. Перезапускаем..."
    pm2 restart cbk-server
else
    echo "Процесс cbk-server не найден. Выполняем первоначальный запуск..."

    # Первый запуск приложения
    pm2 start dist/index.js --name cbk-server

    # Сохраняем список процессов для автозапуска при перезагрузке системы
    pm2 save

    # Настраиваем pm2 как системную службу (если ещё не настроено)
    pm2 startup systemd -u "$USER" --hp "$HOME" || true

    echo "Первоначальная настройка завершена."
fi

echo "Деплой завершён"