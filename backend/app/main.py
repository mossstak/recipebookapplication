from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, validator
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8000",
    "https://recipebookapplication.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Ingredient(BaseModel):
    name: str
    quantity: str

class Instruction(BaseModel):
    step: int
    direction: str

class Recipe(BaseModel):
    title: str
    description: str
    servings: str
    prep_time: int = Field(..., description="Preparation time in minutes")
    cook_time: int = Field(..., description="Cooking time in minutes")
    ingredients: List[Ingredient]
    instructions: List[Instruction]
    
    @validator('prep_time', 'cook_time')
    def check_time_positive(cls, v):
        if v <= 0:
            raise ValueError('Time must be positive')
        return v

class RecipeModel(Recipe):
    id: int
    
    class Config:
        orm_mode = True

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/recipes/", response_model=RecipeModel)
async def create_recipe(recipe: Recipe, db: Session = Depends(get_db)):
    db_recipe = models.Recipe(
        title=recipe.title,
        description=recipe.description,
        servings=recipe.servings,
        prep_time=recipe.prep_time,
        cook_time=recipe.cook_time
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    
    for ingredient_data in recipe.ingredients:
        ingredient = models.Ingredient(
            name=ingredient_data.name,
            quantity=ingredient_data.quantity,  # Ensure 'quantity' is a valid field in your model
            recipe_id=db_recipe.id
        )
        db.add(ingredient)  # This line should be inside the loop

    for instruction_data in recipe.instructions:
        instruction = models.Instruction(
            step=instruction_data.step,
            direction=instruction_data.direction,
            recipe_id=db_recipe.id
        )
        db.add(instruction)  # This line should be inside the loop

    db.commit()
    return db_recipe

@app.get("/recipes/", response_model=List[RecipeModel])
async def read_all_recipes(db: Session = Depends(get_db)):
    recipes = db.query(models.Recipe).all()
    return recipes

@app.put("/recipes/{recipe_id}", response_model=RecipeModel)
async def update_recipe(recipe_id: int, recipe_data: Recipe, db: Session = Depends(get_db)):
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # Update the main recipe fields
    db_recipe.title = recipe_data.title
    db_recipe.description = recipe_data.description
    db_recipe.servings = recipe_data.servings
    db_recipe.prep_time = recipe_data.prep_time
    db_recipe.cook_time = recipe_data.cook_time

    # Fetch existing instructions
    existing_instructions = db.query(models.Instruction).filter(models.Instruction.recipe_id == recipe_id).all()
    existing_steps = {instruction.step: instruction for instruction in existing_instructions}

    # Update or Add instructions
    for instruction_data in recipe_data.instructions:
        if instruction_data.step in existing_steps:
            # Update existing instruction
            existing_instruction = existing_steps[instruction_data.step]
            existing_instruction = existing_instruction [instruction_data.direction]
        else:
            # Add new instruction
            new_instruction = models.Instruction(
                step=instruction_data.step,
                direction=instruction_data.direction,
                recipe_id=db_recipe.id
            )
            db.add(new_instruction)

    # Remove instructions that are no longer present
    incoming_steps = set(instruction.step for instruction in recipe_data.instructions)
    for existing_instruction in existing_instructions:
        if existing_instruction.step not in incoming_steps:
            db.delete(existing_instruction)

    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@app.delete("/recipes/{id}", response_model=dict)
async def delete_recipe(id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.delete(recipe)
    db.commit()
    return {"Recipe": True}