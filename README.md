Предварительные действия
```
sudo apt install python3-venv nginx mc git htop
git clone https://github.com/mugur-aksy/family_tree.git
```

1. Бэкенд:
```


source venv/bin/activate
pip install -r 
python main.py &

sudo systemctl daemon-reload
sudo systemctl enable family-tree-backend
sudo systemctl start family-tree-backend

sudo systemctl status family-tree-backend
sudo systemctl status nginx
```