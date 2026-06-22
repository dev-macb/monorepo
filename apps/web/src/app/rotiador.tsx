import { createBrowserRouter, Navigate } from 'react-router-dom';
import { EntrarPage } from '../modules/entrar/entrar.page';
import { RegistrarSePage } from '../modules/registrar-se/registrar-se.page';
import { InicioPage } from '../modules/inicio/inicio.page';
import { EtiquetasPage } from '../modules/etiquetas/etiquetas.page';

const rotiador = createBrowserRouter([
    {
        path: '/',
        element: <InicioPage />,
    },
    {
        path: '/etiquetas',
        element: <EtiquetasPage />,
    },
    {
        path: '/entrar',
        element: <EntrarPage />,
    },
    {
        path: '/registrar-se',
        element: <RegistrarSePage />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

export { rotiador };