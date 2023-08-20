import { lazy } from 'react';

// const Input = lazy(() => import('./input.jsx'))
// const Snackbar = lazy(() => import('./Snackbar.jsx'))
// const Backdrop = lazy(() => import('./backdrop.jsx'))
// const Navbar = lazy(() => import('./navbar.jsx'))
// const Drawer = lazy(() => import('./drawer.jsx'))
// const DeleteModal = lazy(() => import('./deleteModal.jsx'))
// const ConfirmModal = lazy(() => import('./confirmModal.jsx'))
// const FinishModal = lazy(() => import('./finishModal.jsx'))

export { default as Input } from './input.jsx';
export { default as Snackbar } from './Snackbar.jsx';
export { default as Backdrop } from './backdrop.jsx';
// export { default as Sidenav } from './sidenav.js';
export { default as Navbar } from './navbar.jsx';
export { default as Drawer } from './drawer.jsx'
export { default as DeleteModal } from './deleteModal.jsx';
export { default as ConfirmModal } from './confirmModal.jsx';
export { default as FinishModal } from './finishModal.jsx';
export { default as CustomHead } from './head.jsx'

// export { 
//     Input, 
//     Backdrop, 
//     ConfirmModal, 
//     DeleteModal, 
//     Drawer, 
//     FinishModal, 
//     Navbar, 
//     Snackbar,
// }