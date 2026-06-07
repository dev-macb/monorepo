// App.tsx
import { EntrarPage } from './modules/entrar/entrar.page';
import { InicioPage } from './modules/inicio/inicio.page';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { UsuarioProvider } from './shared/contexts/usuario.context';

function App() {
    const roteador = createBrowserRouter([
        {
            path: '/',
            element: <InicioPage />,
        },
        {
            path: '/entrar',
            element: <EntrarPage />,
        },
        {
            path: '*',
            element: <Navigate to="/" replace />,
        },
    ]);

    return (
        <UsuarioProvider>
            <RouterProvider router={roteador} />
        </UsuarioProvider>
    );
}

export { App };