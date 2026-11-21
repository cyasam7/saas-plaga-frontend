import type React from 'react';
import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import { Search, Edit, Delete, Add, People } from '@mui/icons-material';
import { ClientType } from 'src/app/requests/clients/types';
import { useQueryGetClient } from 'src/app/requests/clients/useQueryGetClient';
import { ClientListProps } from './types';
import { NewClientForm } from '../../Forms/NewClientForm';
import { FormClientValues } from '../../Forms/NewClientForm/types';
import { clientToFormValues } from '../../Forms/NewClientForm/mapper';
import { ClientCard } from '../../Cards/ClientCard';
import PageContentCard from 'app/shared/components/PageContentCard/PageContentCard';
import EmptyState from 'app/shared/components/EmptyState/EmptyState';
import SearchField from 'app/shared/components/SearchField/SearchField';
import useTabParam from 'src/app/shared/hooks/useTabParam';
import useFilterParams from 'src/app/shared/hooks/useFilterParams';

const CLIENT_TYPE_TABS: readonly ('all' | ClientType)[] = ['all', 'business', 'individual'];
const CLIENT_FILTER_KEYS = ['search'] as const;

export function ClientList({ clients, onSaveClient, onDeleteClient }: ClientListProps) {
  const { filters, setFilters } = useFilterParams(CLIENT_FILTER_KEYS);
  const searchTerm = filters.search;
  const [activeTab, setActiveTab] = useTabParam(CLIENT_TYPE_TABS);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showSaveClientForm, setShowSaveClientForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Al editar se carga el cliente completo (con ubicaciones) antes de abrir el formulario.
  const [editingClientId, setEditingClientId] = useState('');
  const { data: editingClient } = useQueryGetClient({ clientId: editingClientId }, Boolean(editingClientId));
  const editingClientFormValues = useMemo(
    () => (editingClient ? clientToFormValues(editingClient) : undefined),
    [editingClient]
  );
  const isLoadingEditingClient = Boolean(editingClientId) && !editingClient;

  // Filtrar clientes según búsqueda y tipo
  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      client.name.toLowerCase().includes(term) ||
      (client.email?.toLowerCase().includes(term) ?? false) ||
      (client.phone?.includes(searchTerm) ?? false);

    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && client.type === activeTab;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, clientId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedClientId(clientId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newClientTypeTab: 'all' | ClientType) => {
    setActiveTab(newClientTypeTab);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (selectedClientId) setEditingClientId(selectedClientId);
    setShowSaveClientForm(true);
  };

  const handleDelete = () => {
    handleMenuClose();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedClientId && onDeleteClient) {
      onDeleteClient(selectedClientId);
    }
    setShowDeleteDialog(false);
    setSelectedClientId(null);
  };

  const handleFormSubmit = async (data: FormClientValues) => {
    await onSaveClient?.(data, selectedClientId);
    handleFormClose();
  };

  const handleFormClose = () => {
    setShowSaveClientForm(false);
    setSelectedClientId(null);
    setEditingClientId('');
  };

  const showEmptyState = clients.length === 0;
  const showNoResults = clients.length > 0 && filteredClients.length === 0;

  return (
    <PageContentCard
      filters={
        !showEmptyState && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, flex: 1 }}>
              <SearchField
                placeholder="Buscar por nombre, correo o teléfono"
                ariaLabel="Buscar clientes"
                value={searchTerm}
                onChange={(nextSearchTerm) => setFilters({ search: nextSearchTerm })}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  minHeight: '40px',
                  '.MuiTab-root': { minHeight: '40px' }
                }}
              >
                <Tab
                  label="Todos"
                  value="all"
                />
                <Tab
                  label="Empresas (B2B)"
                  value="business"
                />
                <Tab
                  label="Residencial"
                  value="individual"
                />
              </Tabs>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setShowSaveClientForm(true)}
              sx={{ fontWeight: 600 }}
            >
              Nuevo cliente
            </Button>
          </Box>
        )
      }
      footer={
        !showEmptyState && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Mostrando {filteredClients.length} de {clients.length} clientes
          </Typography>
        )
      }
    >
      {showEmptyState ? (
        <EmptyState
          icon={People}
          title="No hay clientes"
          description="Comienza agregando tu primer cliente."
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setShowSaveClientForm(true)}
              sx={{ fontWeight: 600 }}
            >
              Nuevo cliente
            </Button>
          }
        />
      ) : showNoResults ? (
        <EmptyState
          icon={Search}
          title="No se encontraron resultados"
          description="Intenta con otros términos de búsqueda o filtros."
        />
      ) : (
        <Grid container spacing={3} sx={{ pt: 1 }}>
          {filteredClients.map((client) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={client.id}
            >
              <ClientCard client={client} onMenuOpen={handleMenuOpen} />
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        {/* <MenuItem onClick={handleMenuClose}>
          <Schedule fontSize="small" sx={{ mr: 1 }} />
          Programar servicio
        </MenuItem> */}
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Form unificado para crear/editar cliente */}
      <NewClientForm
        open={showSaveClientForm && !isLoadingEditingClient}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        defaultValues={editingClientFormValues}
      />

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContentCard>
  );
} 