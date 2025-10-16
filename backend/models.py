from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional

Base = declarative_base()


# Database Models
class PersonDB(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    birth_date = Column(String, nullable=True)
    parent_id = Column(Integer, ForeignKey('persons.id'), nullable=True)

    # Self-referential relationship
    children = relationship("PersonDB", back_populates="parent")
    parent = relationship("PersonDB", back_populates="children", remote_side=[id])

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


# Pydantic Models
class PersonBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: Optional[str] = None


class PersonCreate(PersonBase):
    parent_id: Optional[int] = None


class Person(PersonBase):
    id: int
    parent_id: Optional[int] = None
    full_name: str  # Добавляем поле full_name

    class Config:
        from_attributes = True


class PersonWithChildren(Person):
    children: List['PersonWithChildren'] = []


# Функция для преобразования DB модели в Pydantic модель
def person_from_db(person_db: PersonDB) -> Person:
    return Person(
        id=person_db.id,
        first_name=person_db.first_name,
        last_name=person_db.last_name,
        birth_date=person_db.birth_date,
        parent_id=person_db.parent_id,
        full_name=person_db.get_full_name()  # Используем метод get_full_name
    )