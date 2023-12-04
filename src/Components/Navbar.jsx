/* eslint-disable no-unused-vars */
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Box, Container } from '@mui/material'

export default function Navbar() {
  return (
    <div>
      <nav>
        <Box sx={{ display: 'flex', height: '80px'}}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'black',
              fontFamily: 'arial',
              padding: '30px 150px',
            }}
          >
            Cookbook
          </Link>
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Box sx={{ display: 'flex', gap: '1rem', margin: '30px' }}>
              <NavLink
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  fontFamily: 'arial',
                }}
                to={'/'}
              >
                Home
              </NavLink>
              <NavLink
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  fontFamily: 'arial',
                }}
                to={'/form'}
              >
                Add Recipe
              </NavLink>
              <NavLink
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  fontFamily: 'arial',
                }}
                to={'/viewrecipe'}
              >
                View Recipe
              </NavLink>
            </Box>
          </Container>
        </Box>
      </nav>
    </div>
  )
}
