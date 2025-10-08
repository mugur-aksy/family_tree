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

    class Config:
        from_attributes = True


class PersonWithChildren(Person):
    children: List['PersonWithChildren'] = []