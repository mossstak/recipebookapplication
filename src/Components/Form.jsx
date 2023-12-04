/* eslint-disable no-unused-vars */
import { React, useState } from 'react'
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  Input,
  TextField,
  Button,
} from '@mui/material'
import api from '../api'

const recipeData = {
  title: '',
  description: '',
  servings: '1 People',
  prep_time: '1',
  cook_time: '1',
  ingredients: [{ id: 1, name: '', quantity: '' }],
  instructions: [{ id: 1, step: 1, direction: '' }],
}

const Form = () => {
  const [formData, setFormData] = useState(recipeData)
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    try {
      await api.post('/recipes/', formData)
      alert('Recipe added successfully!')
      setFormData({
        title: '',
        description: '',
        servings: '1 People',
        prep_time: '1',
        cook_time: '1',
        ingredients: [{ name: '', quantity: '' }],
        instructions: [{ step: 1, direction: '' }],
      })
    } catch (error) {
      console.error('Error adding recipe:', error)
      alert('Failed to add recipe. Please try again.')
    }
  }

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }],
    })
  }

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [
        ...formData.instructions,
        { step: formData.instructions.length + 1, direction: '' },
      ],
    })
  }

  const handleInputChange = (event) => {
    const value = event.target.value
    setFormData({
      ...formData,
      [event.target.name]: value,
    })
  }

  const handleChange = (e, id, field) => {
    if (field === 'ingredient') {
      const newIngredients = formData.ingredients.map((ingredient) => {
        if (ingredient.id === id) {
          return { ...ingredient, [e.target.name]: e.target.value }
        }
        return ingredient
      })
      setFormData({ ...formData, ingredients: newIngredients })
    } else if (field === 'instruction') {
      const newInstructions = formData.instructions.map((instruction) => {
        if (instruction.id === id) {
          return { ...instruction, [e.target.name]: e.target.value }
        }
        return instruction
      })
      setFormData({ ...formData, instructions: newInstructions })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }
  return (
    <Container maxWidth="sm">
      <Box>
        <FormControl onSubmit={handleFormSubmit}>
          <TextField
            id="standard-multiline-static"
            type="text"
            variant="standard"
            label="Recipe Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />

          <TextField
            type="text"
            id="standard-multiline-static"
            label="Description"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="standard"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <Box
            sx={{
              display: 'flex',
              margin: '10px',
              gap: '20px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              type="text"
              name="prep_time"
              label="Preparation Time"
              value={formData.prep_time}
              onChange={handleInputChange}
            />

            <TextField
              type="text"
              name="cook_time"
              label="Cooking Time"
              value={formData.cook_time}
              onChange={handleInputChange}
            />

            <TextField
              type="text"
              name="servings"
              label="Servings"
              value={formData.servings}
              onChange={handleInputChange}
            />
          </Box>

          {/* Render Ingredient Fields */}
          {formData.ingredients.map((ingredient) => (
            <Box
              key={ingredient.id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                justifyItems: 'center',
                margin: '20px',
                gap: '30px',
              }}
            >
              <TextField
                type="text"
                label="Ingredient Name"
                name="name"
                variant="filled"
                value={ingredient.name}
                onChange={(e) => handleChange(e, ingredient.id, 'ingredient')}
              />

              <TextField
                type="text"
                name="quantity"
                label="Quantity"
                variant="filled"
                value={ingredient.quantity}
                onChange={(e) => handleChange(e, ingredient.id, 'ingredient')}
              />
            </Box>
          ))}
          <Button onClick={addIngredient}>Add Ingredient</Button>

          {/* Render Instruction Fields */}
          {formData.instructions.map((instruction) => (
            <Box
              key={instruction.id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                justifyItems: 'center',
                margin: '20px',
                gap: '30px',
              }}
            >
              <TextField
                type="number"
                min={1}
                variant="filled"
                name="step"
                label="Step"
                value={instruction.step}
                onChange={(e) => handleChange(e, instruction.id, 'instruction')}
              />

              <TextField
                type="text"
                id="standard-multiline-static"
                label="Instruction"
                defaultValue="Default Value"
                variant="filled"
                name="direction"
                value={instruction.direction}
                onChange={(e) => handleChange(e, instruction.id, 'instruction')}
              />
            </Box>
          ))}
          <Button onClick={addInstruction}>Add Instruction</Button>

          <Button type="submit">Submit</Button>
        </FormControl>
      </Box>
    </Container>
  )
}

export default Form
