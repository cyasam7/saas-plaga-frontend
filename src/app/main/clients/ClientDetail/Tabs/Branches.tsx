import type React from "react"
import { Box, Grid, Typography, Skeleton, Paper } from "@mui/material"
import { Store } from "@mui/icons-material"
import { Branch } from "../../types"
import { BranchCard } from "../../Cards/BranchCard"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"

// Subtle staggered entrance for the branch grid; movement removed under reduced-motion.
const cardEnter = (index: number) => ({
  animation: `branchFadeInUp 260ms ${EASE_OUT} both`,
  animationDelay: `${Math.min(index, 6) * 50}ms`,
  "@keyframes branchFadeInUp": {
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    animation: "branchFade 200ms ease both",
    "@keyframes branchFade": { from: { opacity: 0 }, to: { opacity: 1 } },
  },
})

interface BranchesTabProps {
  branches: Branch[]
  isLoading?: boolean
  handleMenuClick: (event: React.MouseEvent<HTMLElement>, branchId: string) => void
  headerComponent?: React.ReactNode
}

function BranchesSkeleton() {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export function BranchesTab({ branches, isLoading, handleMenuClick, headerComponent }: BranchesTabProps) {
  if (isLoading) {
    return <BranchesSkeleton />
  }

  return (
    <>
      {headerComponent}
      <Grid container spacing={2}>
        {branches.length > 0 && branches.map((branch, index) => (
          <Grid item xs={12} sm={6} md={4} key={branch.id} sx={cardEnter(index)}>
            <BranchCard branch={branch} onMenuClick={handleMenuClick} />
          </Grid>
        ))}

        {branches.length === 0 && (
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              sx={{ p: 5, textAlign: "center", borderStyle: "dashed", bgcolor: "background.default" }}
            >
              <Store sx={{ fontSize: 44, color: "text.disabled", mb: 1.5 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
                No hay sucursales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Agregue una nueva sucursal para comenzar a gestionar las áreas y dispositivos.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  )
}



