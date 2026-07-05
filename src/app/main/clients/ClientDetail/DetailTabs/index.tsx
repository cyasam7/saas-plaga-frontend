import type React from "react"
import { Box, Tabs, Tab } from "@mui/material"
import {
  Store,
  CalendarMonth,
} from "@mui/icons-material"

export interface DetailTabsProps {
  activeTab: number
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void
}

export function DetailTabs({ activeTab, onTabChange }: DetailTabsProps) {
  const getTabs = [
    {
      icon: <Store />,
      label: "Sucursales",
      color: "primary.main",
    },
    {
      icon: <CalendarMonth />,
      label: "Historial",
      color: "success.main",
    },
  ]
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs value={activeTab} onChange={onTabChange}>
        {getTabs.map((tab, index) => (
          <Tab
            key={index}
            icon={tab.icon}
            label={tab.label}
            iconPosition="start"
            sx={{ color: tab.color }}
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default DetailTabs 