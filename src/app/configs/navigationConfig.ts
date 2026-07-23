import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
  {
    id: 'modules-app',
    title: 'Usuarios',
    type: 'group',
    children: [
      {
        id: 'membership',
        title: 'Membresías',
        type: 'item',
        icon: 'heroicons-outline:users',
        auth: ['admin'],
        url: '/membership'
      },
      {
        id: 'users',
        title: 'Trabajadores',
        type: 'item',
        icon: 'heroicons-outline:users',
        auth: ['staff'],
        url: '/users'
      },
      {
        id: 'clients',
        title: 'Clientes',
        type: 'item',
        auth: ['staff'],
        icon: 'material-twotone:person_pin',
        url: '/clients',
        children: []
      }
    ]
  },
  {
    id: 'orders-app',
    title: 'Ordenes',
    type: 'group',
    auth: ['staff'],
    icon: 'material-outline:assignment',
    children: [
      {
        id: 'orders-created',
        title: 'Registradas',
        type: 'item',
        auth: ['staff'],
        icon: 'material-outline:assignment',
        url: '/orders',
        end: true
      },
      {
        id: 'orders-history',
        title: 'Historial',
        type: 'item',
        auth: ['staff'],
        icon: 'material-outline:history',
        url: '/orders/history'
      }
    ]
  },
  {
    id: 'configurations-app',
    title: 'Configuración',
    auth: ['staff'],
    type: 'group',
    icon: 'heroicons-solid:adjustments',
    children: [
      {
        id: 'catalogs',
        title: 'Catálogos',
        type: 'item',
        auth: ['staff'],
        icon: 'heroicons-outline:archive',
        url: '/catalogs',
        children: []
      },
      {
        id: 'configurations-account',
        title: 'Reportes',
        type: 'item',
        auth: ['staff'],
        icon: 'heroicons-outline:document-report',
        url: '/configuration/reports'
      }
    ]
  }
];

export default navigationConfig;
