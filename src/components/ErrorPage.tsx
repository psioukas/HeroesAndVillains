import { Box, BoxProps, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Button from './Button';

const StyledErrorContainer = styled(Box)<BoxProps>(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

const ErrorPage = () => {
    const theme = useTheme();
    return (
        <StyledErrorContainer>
            <Typography variant={'h1'} color={'#6098f2'} fontWeight={'800'} mb={12}>
                OOPS!
            </Typography>
            <Typography variant={'h5'} fontWeight={'bold'} mb={6}>
                We cannot find the page you are looking for.
            </Typography>
            <Button
                variant={'outlined'}
                textColor={'#6098f2'}
                bgColor={theme.palette.background.default}
                activeBgColor={'#6098f2'}
                activeTextColor={'#fff'}
                size={'small'}
                sx={{
                    width: 'fit-content',
                }}
                onClick={() => {
                    window.location.href = window.location.origin;
                }}
            >
                <Typography variant={'h6'} fontWeight={'bold'}>
                    Visit homepage
                </Typography>
            </Button>
        </StyledErrorContainer>
    );
};

export default ErrorPage;
