import { Box, CircularProgress, Typography } from '@mui/material'
interface ILoader {
    msg: string
    color: string
}
const Loader = ({ msg, color }: ILoader) => {
    return (
        <Box
            height={'100%'}
            width={'100%'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={4}
        >
            <CircularProgress size={'100px'} sx={{ color }} />
            <Typography variant={'h4'} textAlign={'center'}>
                {msg}
            </Typography>
        </Box>
    )
}

export default Loader
