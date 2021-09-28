
import { AppRouter } from './router/AppRouter';
import { QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient();
export const BuenDocApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AppRouter />
        </QueryClientProvider>
    )
}