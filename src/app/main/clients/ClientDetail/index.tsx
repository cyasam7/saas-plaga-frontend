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
import { useSearchParams } from "react-router-dom"
import DetailTabs from "./DetailTabs"
import ClientInfo from "./ClientInfo"
import { BranchForm } from "../Forms/BranchForm"
import { useQueryGetClient } from "src/app/requests/clients/useQueryGetClient"
import { useMutationSaveClient } from "src/app/requests/clients/useMutationSaveClient"
import { IBranchesResponse, useQueryBranches } from "src/app/requests/branches/useQueryBranches"
import { useMutationDeleteBranch } from "src/app/requests/branches/useMutationDeleteBranch"
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import { HistoryTab } from "./Tabs/History"
import { BranchesTab } from "./Tabs/Branches"
import PageHeader from "../PageHeader"
import { FormClientValues } from "../Forms/NewClientForm/types"


export function ClientDetail() {
  const { openDialog } = useGlobalDialog();
  const navigate = useNavigate()

  const { clientId = "" } = useParams()

  const { data: client, isLoading, refetch: refetchClient } = useQueryGetClient({ clientId }, Boolean(clientId))
  const { mutateAsync: saveClient } = useMutationSaveClient()
  const { mutateAsync: deleteBranch } = useMutationDeleteBranch()

  const isBusiness = client?.type === "business"

  const handleSaveSection = async (values: FormClientValues) => {
    if (!clientId) return
    await saveClient({ ...values, id: clientId })
    await refetchClient()
    if (values.type === "business") {
      await refetchBranches()
    }
  }

  const {
    data: branches = [],
    isLoading: isLoadingBranches,
    refetch: refetchBranches,
  } = useQueryBranches({ clientId }, isBusiness)

  const [searchParams, setSearchParams] = useSearchParams()
  const [isBranchFormOpen, setIsBranchFormOpen] = useState(false)
  const [currentBranch, setCurrentBranch] = useState<IBranchesResponse[number] | null>(null)
  // Vacío = alta de sucursal; con id = edición.
  const [editingBranchId, setEditingBranchId] = useState("")
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  // Tab selection is driven by the `tabSelected` query param so it is linkable and
  // survives refresh/back-navigation. Available tabs depend on the client type.
  const tabKeys = isBusiness ? ["branches", "history"] : ["history"]
  const activeTab = Math.max(0, tabKeys.indexOf(searchParams.get("tabSelected") ?? ""))
  const resolvedTab = tabKeys[activeTab]

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set("tabSelected", tabKeys[newValue])
        return next
      },
      { replace: true }
    )
  }

  const handleAddBranch = () => {
    setEditingBranchId("")
    setIsBranchFormOpen(true)
  }

  const handleEditBranch = (branch: IBranchesResponse[number]) => {
    setEditingBranchId(branch.id)
    setIsBranchFormOpen(true)
    handleMenuClose()
  }

  // El cliente también trae sus ubicaciones con áreas, así que se refrescan ambos.
  async function handleBranchFormSaved() {
    await Promise.all([refetchBranches(), refetchClient()])
  }

  const handleDeleteBranch = (branchId: string) => {
    handleMenuClose()
    openDialog({
      title: "Eliminar Sucursal",
      text: "¿Está seguro que desea eliminar esta sucursal? Esta acción no se puede deshacer.",
      onAccept: async () => {
        await deleteBranch({ branchId })
        await refetchBranches()
      },
    })
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
      <ClientInfo client={client} loading={isLoading} onSave={handleSaveSection} />
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <DetailTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            showBranches={isBusiness}
          />
          {isBusiness && resolvedTab === "branches" && (
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
          {resolvedTab === "history" && (<HistoryTab clientId={clientId} />)}
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
        open={isBranchFormOpen}
        clientId={clientId}
        branchId={editingBranchId}
        onClose={() => setIsBranchFormOpen(false)}
        onSaved={handleBranchFormSaved}
      />
    </Box>
  )
}

export default ClientDetail; 