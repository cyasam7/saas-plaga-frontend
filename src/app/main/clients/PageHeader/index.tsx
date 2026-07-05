import React from 'react'
import { Box, Button, Typography, Paper, Breadcrumbs, Link } from '@mui/material'
import { ArrowBack, NavigateNext } from '@mui/icons-material'
import { PageHeaderProps } from './types'

const PageHeader = ({ title, onBack, children, breadcrumbs }: PageHeaderProps) => {
  const defaultBreadcrumbs = [
    { label: 'Clientes', onClick: onBack },
    { label: title }
  ]

  const items = breadcrumbs || defaultBreadcrumbs

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.04)',
              color: 'primary.main'
            }
          }}
        >
          Volver
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ color: 'text.secondary' }}
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1

              if (isLast) {
                return (
                  <Typography key={item.label} color="text.primary">
                    {item.label}
                  </Typography>
                )
              }

              return (
                <Link
                  key={item.label}
                  underline="hover"
                  color="inherit"
                  onClick={item.onClick}
                  sx={{ cursor: item.onClick ? 'pointer' : 'default' }}
                >
                  {item.label}
                </Link>
              )
            })}
          </Breadcrumbs>
        </Box>
        {children}
      </Box>
    </Box>
  )
}

export default PageHeader 