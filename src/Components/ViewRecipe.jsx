/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from 'react'
import {
  Card,
  Button,
  Box,
  Container,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import styled from '@emotion/styled'
import api from '../api'

const ViewRecipe = () => {
  const [recipes, setRecipes] = useState([])

  const fetchRecipe = async () => {
    const response = await api.get('/recipes/')
    setRecipes(response.data)
    console.log(response.data)
  }

  useEffect(() => {
    fetchRecipe()
  }, [])
  return (
    <div id="viewrecipe">
      <Card
        sx={{
          bgcolor: '#cfe8fc',
          margin: '10px',
          padding: '15px',
          maxWidth: '850px',
        }}
      >
        {recipes.map((recipe) => (
          <CardContent key={recipe.id}>
            <Typography
              sx={{ fontSize: 28 }}
              color="text.secondary"
              textAlign="center"
              gutterBottom
            >
              {recipe.title}
            </Typography>
            <Typography sx={{ fontSize: 18, textAlign: 'justify'}}>{recipe.description}</Typography>
            <Typography>
              {'Servings'}: {recipe.servings}
            </Typography>
            <Typography>
              {'Preparation Time'}: {recipe.prep_time + ' mins'}
            </Typography>
            <Typography>
              {'Cooking Time'}: {recipe.cook_time + ' mins'}
            </Typography>
            <CardContent>
              {recipe.ingredients.map((ingredient) => (
                <Typography key={ingredient.id}>
                  <Typography>
                    {ingredient.name} {ingredient.quantity}
                  </Typography>
                </Typography>
              ))}
            </CardContent>
            <CardContent>
              {recipe.instructions.map((instruction) => (
                <Typography sx={{display: 'flex', gap: '2em', margin: '5px 0'}} key={instruction.step}>
                  <Typography sx={{fontWeight: 'bold'}}>{instruction.step}</Typography>
                  {instruction.direction}
                </Typography>
              ))}
            </CardContent>
          </CardContent>
        ))}
      </Card>
    </div>
  )
}

export default ViewRecipe
