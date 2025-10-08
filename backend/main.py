from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import database
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Family Tree API")

# CORS middleware для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создание таблиц при запуске
models.Base.metadata.create_all(bind=database.engine)

@app.post("/persons/", response_model=models.Person)
def create_person(person: models.PersonCreate, db: Session = Depends(database.get_db)):
    db_person = models.PersonDB(**person.dict())
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

@app.get("/persons/", response_model=List[models.Person])
def read_persons(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    persons = db.query(models.PersonDB).offset(skip).limit(limit).all()
    return persons

@app.get("/persons/{person_id}", response_model=models.PersonWithChildren)
def read_person(person_id: int, db: Session = Depends(database.get_db)):
    person = db.query(models.PersonDB).filter(models.PersonDB.id == person_id).first()
    if person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

@app.get("/tree/", response_model=List[models.PersonWithChildren])
def get_family_tree(db: Session = Depends(database.get_db)):
    # Получаем всех людей без родителей (корни дерева)
    root_persons = db.query(models.PersonDB).filter(models.PersonDB.parent_id == None).all()
    return root_persons

@app.get("/persons/{person_id}/children", response_model=List[models.Person])
def get_children(person_id: int, db: Session = Depends(database.get_db)):
    children = db.query(models.PersonDB).filter(models.PersonDB.parent_id == person_id).all()
    return children

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)