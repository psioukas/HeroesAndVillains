import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {Alert, AlertColor, Box, BoxProps, IconButton, Snackbar, Typography, useMediaQuery,} from '@mui/material';
import {styled, Theme} from '@mui/material/styles';
import {observer} from 'mobx-react-lite';
import {useEffect, useState} from 'react';
import Button from './components/Button';
import ErrorPage from './components/ErrorPage';
import Loader from './components/Loader';
import Modals from './components/modal/Modals';
import Store from './store';
import HeroesList from "./components/HeroesList";

const StyledApp = styled(Box)<BoxProps>(({theme}) => ({
    background: theme.palette.background.default,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
        paddingLeft: theme.spacing(16),
        paddingRight: theme.spacing(12),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(4),
    },
}));

const App = () => {
    const [showErrorPage, _setShowErrorPage] = useState<boolean>(false);
    const isMobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        // create 2s delay
        setTimeout(() => {
            Store.setLoading();
        }, 2000);
    }, []);

    return (<StyledApp>
        <Typography variant={'h1'} color={'#65cd95'} align={'center'}>
            Heroes App
        </Typography>
        {!showErrorPage ? (<>
            <Snackbar
                open={Store.notification.isVisible}
                onClose={Store.notification.close}
                autoHideDuration={1000}
            >
                <Alert variant="filled" severity={Store.notification.type as AlertColor}>
                    {Store.notification.msg}
                    <IconButton
                        onClick={Store.notification.close}
                        size={'small'}
                        sx={{ml: 1}}
                    >
                        <CloseIcon fontSize={'small'}/>
                    </IconButton>
                </Alert>
            </Snackbar>

            {Store.loading ? (<Loader msg={'Please wait fetching data'} color={'#65cd95'}/>) : (<>
                <Button
                    variant="contained"
                    bgColor={'#65cd95'}
                    textColor={'#fffffff'}
                    activeBgColor={'#3e815d'}
                    fullWidth
                    onClick={() => {
                        Store.modals.addHero.setVisibility(true);
                    }}
                    sx={{mb: isMobileView ? 4 : 9}}
                    startIcon={<AddIcon/>}
                >
                    Add Hero
                </Button>
                <HeroesList/>
                <Modals/>
            </>)}
        </>) : (<ErrorPage/>)}
    </StyledApp>);
};

export default observer(App);