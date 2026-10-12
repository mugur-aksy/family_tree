Предварительные действия
```
sudo apt install python3-venv nginx mc git htop pip virtualenv
git clone https://github.com/mugur-aksy/family_tree.git
```

1. Автомизированный запуск

```
cd family_tree/
chmod 777 start_project.sh
./start_project.sh
```


Для интереса по отдельности
2. Бэкенд:
```
cd backend
virtualenv -p python3 venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python main.py &
deactivate

sudo systemctl enable family-tree-backend
sudo systemctl start family-tree-backend
sudo systemctl daemon-reload

sudo systemctl status family-tree-backend
sudo systemctl status nginx
```

3. Фронтенд
```
sudo chmod o+x /home/mengi
sudo chmod o+x /home/mengi/family_tree
sudo chmod -R o+rX /home/mengi/family_tree/frontend

# Перезапускаем nginx
sudo cp /home/mengi/family_tree/family-tree /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/family-tree /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t

echo "Restarting nginx..."
sudo systemctl restart nginx
```

