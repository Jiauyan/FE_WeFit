import { ThemeColorProvider } from './ThemeProvider';
import { UserProvider } from './UseContext';

export const AllProvider = ({ children }) => {
    return (
        <ThemeColorProvider>
            <UserProvider>
                { children }
            </UserProvider>
        </ThemeColorProvider>
    )

}