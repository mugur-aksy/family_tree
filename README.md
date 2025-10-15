Предварительные действия
```
sudo apt install python3-venv nginx mc git htop

sudo cp family-tree /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/family-tree /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo chown -R ansible:ansible /home/ansible/family_tree
sudo nginx -t



```

1. Бэкенд:
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py &

sudo systemctl daemon-reload
sudo systemctl enable family-tree-backend
sudo systemctl start family-tree-backend

sudo systemctl status family-tree-backend
sudo systemctl status nginx
```