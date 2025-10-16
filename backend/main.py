from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import database
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Family Tree API")

# CORS middleware
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
    return models.person_from_db(db_person)  # Используем функцию преобразования


@app.get("/persons/", response_model=List[models.Person])
def read_persons(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    persons = db.query(models.PersonDB).offset(skip).limit(limit).all()
    return [models.person_from_db(person) for person in persons]  # Преобразуем каждую запись


@app.get("/persons/{person_id}", response_model=models.PersonWithChildren)
def read_person(person_id: int, db: Session = Depends(database.get_db)):
    person = db.query(models.PersonDB).filter(models.PersonDB.id == person_id).first()
    if person is None:
        raise HTTPException(status_code=404, detail="Person not found")

    # Создаем PersonWithChildren с full_name
    person_data = models.person_from_db(person)
    children_data = [models.person_from_db(child) for child in person.children]

    return models.PersonWithChildren(
        **person_data.dict(),
        children=children_data
    )


@app.get("/tree/", response_model=List[models.PersonWithChildren])
def get_family_tree(db: Session = Depends(database.get_db)):
    # Получаем всех людей без родителей (корни дерева)
    root_persons = db.query(models.PersonDB).filter(models.PersonDB.parent_id == None).all()

    def build_tree(person_db):
        person_data = models.person_from_db(person_db)
        children_data = [build_tree(child) for child in person_db.children]
        return models.PersonWithChildren(
            **person_data.dict(),
            children=children_data
        )

    return [build_tree(person) for person in root_persons]


@app.get("/persons/{person_id}/children", response_model=List[models.Person])
def get_children(person_id: int, db: Session = Depends(database.get_db)):
    children = db.query(models.PersonDB).filter(models.PersonDB.parent_id == person_id).all()
    return [models.person_from_db(child) for child in children]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)