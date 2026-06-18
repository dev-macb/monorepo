import { RouterProvider } from 'react-router-dom';
import { DependenciaProvider } from '../shared/di/container';
import { AutenticacaoProvider } from '../shared/contexts/autenticacao.context';
import { rotiador } from './rotiador';

function App() {
    return (
        <DependenciaProvider>
            <AutenticacaoProvider>
                <RouterProvider router={rotiador} />
            </AutenticacaoProvider>
        </DependenciaProvider>
    );
}

export { App };
