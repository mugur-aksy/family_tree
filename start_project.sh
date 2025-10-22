#!/bin/bash
echo "Starting backend..."

cd family_tree/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py &
BACKEND_PID=$!
deactivate
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
sudo cp /home/ansible/family_tree/family-tree /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/family-tree /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
#sudo chown -R ansible:ansible /home/ansible/family_tree
sudo nginx -t

echo "Restarting nginx..."
sudo systemctl restart nginx

echo "Project is running!"