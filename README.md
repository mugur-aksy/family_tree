Предварительные действия
```
sudo apt install python3-venv nginx mc git htop pip virtualenv
git clone https://github.com/mugur-aksy/family_tree.git
```

1. Бэкенд:
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


