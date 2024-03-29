import DeleteIcon from '@mui/icons-material/Delete';
import { Box, BoxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import Store from '../../store';
import HeroApiRequests from '../../utils/HeroApiRequests';
import Button from '../Button';
import HeroAvatar from '../hero/HeroAvatar';

const StyledHeroDetailsView = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        gap: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
        height: '100%',
        '& .btnDelete': {
            position: 'absolute',
            bottom: theme.spacing(4.5),
            left: 0,
            right: 0,
        },
    },
}));

const HeroDetailsView = () => {
    const hero = Store.selectedHero;
    useEffect(() => {
        if (hero && !window.location.pathname.includes(hero.id)) {
            window.history.pushState(undefined, '', `${window.location.origin}/details/${hero.id}`);
        }
        return () => {
            window.history.pushState(undefined, '', `${window.location.origin}`);
        };
    }, [hero]);

    const handleDeleteHero = async () => {
        if (!hero) return;
        // const successfull: boolean = await HeroApiRequests.deleteHero(hero.id);
        // if (successfull) {
        Store.notification.show('Please wait deleting hero', 'info');
        setTimeout(() => {
        Store.deleteHero(hero);
            setTimeout(() => {
                Store.notification.show('Hero deleted successfully', 'success');
            }, 100);
        }, 1100);
    };

    return hero ? (
        <StyledHeroDetailsView data-testid='hero-details-view'>
            <HeroAvatar
                src={hero.avatarUrl}
                alt="hero avatar"
                width={94}
                height={94}
                style={{ alignSelf: 'center' }}
                mt={Store.isMobile ? 10 : 0}
            />

            <Typography
                alignSelf={'center'}
                fontWeight={'bold'}
                variant="body1"
                mt={Store.isMobile ? 10 : 0}
                mb={Store.isMobile ? 0.5 : 0}
            >
                {hero.fullName}
            </Typography>
            <Typography alignSelf={'center'} variant="body2" mb={Store.isMobile ? 8 : 0}>
                {hero.type.name}
            </Typography>
            <Typography alignSelf={'center'} variant="body2">
                {hero.description}
            </Typography>
            <Button
                variant={'text'}
                textColor={'#bb4d5f'}
                startIcon={<DeleteIcon />}
                onClick={handleDeleteHero}
                className={'btnDelete'}
            >
                Delete hero
            </Button>
        </StyledHeroDetailsView>
    ) : null;
};

export default observer(HeroDetailsView);
