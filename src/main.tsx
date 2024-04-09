import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
    spacing: 4,
    palette: {
        common: {
            black: '#545657',
            white: '#ffffff',
        },
        background: {
            default: '#f5f7fb',
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </>
)
