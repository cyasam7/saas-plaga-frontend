import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
  {
    id: 'modules-app',
    title: 'Módulos',
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
        title: 'Usuarios',
        type: 'item',
        icon: 'heroicons-outline:users',
        auth: ['staff'],
        url: '/users'
      },
      {
        id: 'orders',
        title: 'Ordenes',
        type: 'item',
        auth: ['staff'],
        icon: 'material-outline:assignment',
        url: '/orders',
        children: []
      },
      {
        id: 'clients',
        title: 'Clientes',
        type: 'item',
        auth: ['staff'],
        icon: 'material-twotone:person_pin',
        url: '/clients',
        children: []
      },
      {
        id: 'catalogs',
        title: 'Catálogos',
        type: 'item',
        auth: ['staff'],
        icon: 'heroicons-outline:archive',
        url: '/catalogs',
        children: []
      }
    ]
  },
  {
    id: 'configurations-app',
    title: 'Reportes',
    auth: ['staff'],
    type: 'group',
    icon: 'heroicons-solid:adjustments',
    children: [
      {
        id: 'configurations-account',
        title: 'Reportes',
        type: 'item',
        auth: ['staff'],
        url: '/configuration/reports'
      }
    ]
  }
];

export default navigationConfig;
