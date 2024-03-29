import {Box, BoxProps, Typography} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {observer} from 'mobx-react-lite';
import Store from '../store';
import {IHero} from '../types';
import HeroListItem from './hero/HeroListItem';

const StyledHeroesList = styled(Box)<IHeroesList>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    overflowY: 'scroll',
    gap: theme.spacing(2),
    paddingRight: theme.spacing(2.5),

    [theme.breakpoints.up('sm')]: {
        height: `calc(100% - ${theme.spacing(23)})`,
        paddingTop: theme.spacing(3.5),
        paddingRight: theme.spacing(2.5),
    },
    [theme.breakpoints.down('sm')]: {
        height: `calc(100% - ${theme.spacing(14)})`,
    },
}));
const StyledHeroesListHeader = styled(Box)<IHeroesList>(({ theme }) => ({
    display: 'flex',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(9),
    gap: theme.spacing(4),
}));

interface IHeroesList extends BoxProps {}
const HeroesList = () => {
    const theme = useTheme();
    
    const heroes = Store.heroes;
    return (
        <>
            {heroes.length > 0 ? (<>
            {!Store.isMobile && (
                <StyledHeroesListHeader>
                    <Box
                        style={{
                            width: theme.spacing(11.25),
                            marginRight: theme.spacing(5),
                        }}
                    />
                    <Typography variant="body1" flex={4}>
                        Hero
                    </Typography>
                    <Typography variant="body1" flex={3}>
                        Type
                    </Typography>
                    <Typography variant="body1" flex={4}>
                        Description
                    </Typography>
                </StyledHeroesListHeader>
            )}

            <StyledHeroesList>
                {heroes.map((hero: IHero) => <HeroListItem key={hero.id} hero={hero}/>)}
            </StyledHeroesList>
                    </>

                ) :
                <Box     width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                    <Typography>
                        No heroes found!
                    </Typography>
                </Box>
            }

        </>
    );
};

export default observer(HeroesList);
