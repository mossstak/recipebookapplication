from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Recipe(Base):
    __tablename__ = 'recipes'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    servings = Column(String)  # Number of servings
    prep_time = Column(Integer)  # Preparation time in minutes
    cook_time = Column(Integer)  # Cooking time in minutes
    ingredients = relationship("Ingredient", back_populates="recipe")
    instructions = relationship("Instruction", back_populates="recipe")

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(String, nullable=False)
    recipe_id = Column(Integer, ForeignKey('recipes.id'))
    recipe = relationship("Recipe", back_populates="ingredients")

class Instruction(Base):
    __tablename__ = "instructions"
    id = Column(Integer, primary_key=True, index=True)
    step = Column(Integer, index=True)
    direction = Column(String, index=True) 
    recipe_id = Column(Integer, ForeignKey('recipes.id'))
    recipe = relationship("Recipe", back_populates="instructions")
