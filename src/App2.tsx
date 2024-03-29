import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
    Alert,
    AlertColor,
    Box,
    BoxProps,
    IconButton,
    Snackbar,
    useMediaQuery,
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Button from './components/Button';
import ErrorPage from './components/ErrorPage';
import HeroesList from './components/HeroesList';
import Loader from './components/Loader';
import Modals from './components/modal/Modals';
import Store from './store';
import HeroApiRequests from './utils/HeroApiRequests';

const StyledApp = styled(Box)<BoxProps>(({ theme, ...props }) => ({
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
    const [showErrorPage, setShowErrorPage] = useState<boolean>(false);
    const isMobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const handleFetchData = async (specificHero?: string) => {
        try {
            if (specificHero) {
                const hero = await HeroApiRequests.getSpecificHero(specificHero);
                if (hero) {
                    Store.addHeroes([hero]);
                    Store.showHeroDetails(hero.id);
                    Store.setLoading(false);
                }
            }
            HeroApiRequests.getHeroesList().then(heroesList => {
                if (Store.loading) {
                    Store.setLoading(false);
                }
                Store.addHeroes(heroesList);
            });
            HeroApiRequests.getTypes().then(typesList => {
                Store.setHeroTypes(typesList);
                if (Store.loading) {
                    Store.setLoading(false);
                }
            });
        } catch (error) {
            setShowErrorPage(true);
        }
    };

    useEffect(() => {
        let heroId = undefined;
        if (window.location.pathname.includes('/details/')) {
            const tempHeroId = window.location.pathname.replace('/details/', '');
            if (tempHeroId.trim()) {
                heroId = tempHeroId;
            }
        }
        handleFetchData(heroId);
    }, []);

    useEffect(() => {
        Store.setIsMobile(isMobileView);
    }, [isMobileView]);

    return (
        <StyledApp>
            {!showErrorPage ? (
                <>
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
                                sx={{ ml: 1 }}
                            >
                                <CloseIcon fontSize={'small'} />
                            </IconButton>
                        </Alert>
                    </Snackbar>

                    {Store.loading ? (
                        <Loader msg={'Please wait fetching data'} color={'#65cd95'} />
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                bgColor={'#65cd95'}
                                textColor={'#fffffff'}
                                activeBgColor={'#3e815d'}
                                fullWidth
                                onClick={() => {
                                    Store.modals.addHero.setVisibility(true);
                                }}
                                sx={{ mb: isMobileView ? 4 : 9 }}
                                startIcon={<AddIcon />}
                            >
                                Add Hero
                            </Button>
                            <HeroesList />
                            <Modals />
                        </>
                    )}
                </>
            ) : (
                <ErrorPage />
            )}
        </StyledApp>
    );
};

export default observer(App);
