import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Menu,
} from "@mui/material"
import {
  Add,
  Edit,
  Delete,
} from "@mui/icons-material"
import { useNavigate, useParams } from "react-router"
import DetailTabs from "./DetailTabs"
import { Branch } from "../types"
import ClientInfo from "./ClientInfo"
import { BranchForm } from "../Forms/BranchForm"
import { useQuery } from "react-query"
import { ClientService } from "src/app/shared/services/ClientService"
import { BranchService } from "src/app/shared/services/BranchService"
import { openDialog } from "app/shared-components/GlobalDialog/openDialog"
import { HistoryTab } from "./Tabs/History"
import { BranchesTab } from "./Tabs/Branches"
import PageHeader from "../PageHeader"
import { FormBranchValues } from "../Forms/BranchForm/types"


export function ClientDetail() {
  const navigate = useNavigate()

  const { clientId } = useParams()

  const { data: client, isLoading, } = useQuery({
    queryKey: ["clients", clientId],
    queryFn: () => {
      return ClientService.byId(clientId)
    }
  })

  const isBusiness = client?.type === "business"

  const { data: branches = [], isLoading: isLoadingBranches, refetch: refetchBranches } = useQuery({
    queryKey: ["branches", clientId],
    queryFn: () => {
      return BranchService.byQuery({ clientId: clientId })
    },
    enabled: isBusiness,
  })

  const [activeTab, setActiveTab] = useState(0)
  const [showBranchForm, setShowBranchForm] = useState(false)
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleAddBranch = () => {
    setCurrentBranch(null)
    setIsEditing(false)
    setShowBranchForm(true)
  }

  const handleEditBranch = (branch: Branch) => {
    setCurrentBranch(branch)
    setIsEditing(true)
    setShowBranchForm(true)
  }

  const handleDeleteBranch = (branchId: string) => {
    handleMenuClose()
    openDialog({
      title: "Eliminar Sucursal",
      text: "¿Está seguro que desea eliminar esta sucursal? Esta acción no se puede deshacer.",
      onAccept: async () => {
        await BranchService.remove(branchId)
        await refetchBranches()
      },
    })
  }

  async function handleSaveBranch(branch: FormBranchValues) {
    await BranchService.save(branch)
    await refetchBranches()
    setShowBranchForm(false)
    handleMenuClose()
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, branchId: string) => {
    setMenuAnchorEl(event.currentTarget)
    const branch = branches.find((b) => b.id === branchId)
    if (branch) {
      setCurrentBranch(branch)
    }
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setCurrentBranch(null)
  }

  return (
    <Box paddingTop={2}>
      <PageHeader
        title="Detalle del Cliente"
        onBack={() => navigate(-1)}
      />
      <ClientInfo client={client} loading={isLoading} />
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <DetailTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            showBranches={isBusiness}
          />
          {isBusiness && activeTab === 0 && (
            <BranchesTab
              branches={branches}
              isLoading={isLoadingBranches}
              handleMenuClick={handleMenuClick}
              headerComponent={
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddBranch}
                    color="primary"
                    sx={{
                      transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
                      '&:active': { transform: 'scale(0.97)' },
                    }}
                  >
                    Agregar Sucursal
                  </Button>
                </Box>}
            />
          )}
          {((isBusiness && activeTab === 1) || (!isBusiness && activeTab === 0)) && (<HistoryTab />)}
        </CardContent>
      </Card>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <Button
          onClick={() => currentBranch && handleEditBranch(currentBranch)}
          startIcon={<Edit />}
          fullWidth
          sx={{ justifyContent: "flex-start", px: 2, py: 1 }}
        >
          Editar
        </Button>
        <Button
          onClick={() => currentBranch && handleDeleteBranch(currentBranch.id)}
          startIcon={<Delete />}
          color="error"
          fullWidth
          sx={{ justifyContent: "flex-start", px: 2, py: 1 }}
        >
          Eliminar
        </Button>
      </Menu>
      <BranchForm
        clientId={clientId}
        open={showBranchForm}
        onClose={() => setShowBranchForm(false)}
        onSave={handleSaveBranch}
        branch={currentBranch}
        isEditing={isEditing}
      />
    </Box>
  )
}

export default ClientDetail; 