import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export const FullScreenLoading = () => {
  return (
  <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // takes most of the viewport height
      }}
    >
      <CircularProgress />
    </Box>
  )
}
