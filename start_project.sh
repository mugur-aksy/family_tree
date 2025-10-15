#!/bin/bash

echo "Starting Family Tree Project..."

# Активируем виртуальное окружение Python (если используется)
# source /home/ansible/family_tree/backend/venv/bin/activate

# Запускаем бэкенд
echo "Starting backend..."
cd /home/ansible/family_tree/backend
python3 main.py &
BACKEND_PID=$!

# Ждем немного чтобы бэкенд запустился
sleep 3

# Проверяем что бэкенд запустился
if ps -p $BACKEND_PID > /dev/null; then
    echo "Backend started with PID: $BACKEND_PID"
else
    echo "Failed to start backend"
    exit 1
fi

# Перезапускаем nginx
echo "Restarting nginx..."
sudo systemctl restart nginx

echo "Project is running!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
echo "Backend direct: http://localhost:8000"

# Ждем завершения бэкенда
wait $BACKEND_PID