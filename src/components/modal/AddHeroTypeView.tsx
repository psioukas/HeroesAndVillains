import {zodResolver} from '@hookform/resolvers/zod';
import {Box, BoxProps, TextField, Typography, TypographyProps,} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useForm} from 'react-hook-form';

import Store from '../../store';
import {HeroTypeSchema, IHeroType} from '../../types';
import {v4} from 'uuid';

import Button from "../Button";

const StyledAddHeroTypeView = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
        height: '100%',
        gap: theme.spacing(7.5),
        position: 'relative',
        '& .btnSave': {
            position: 'absolute',
            bottom: theme.spacing(4.5),
            left: 0,
            right: 0,
        },
    },
}));

const StyledLabel = styled(Typography)<TypographyProps>(() => ({
    color: '#93969e',
}));

const StyledFieldContainer = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
}));


const AddHeroTypeView = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Pick<IHeroType, 'name'>>({
        resolver: zodResolver(HeroTypeSchema.pick({name: true})),
        reValidateMode: 'onBlur',
        mode: 'onBlur',
    });

    const handleAddHeroType = async (heroType: Pick<IHeroType, "name">) => {
        Store.notification.show('Adding hero ...');
        const exists = Store.heroTypes.every(_heroType => heroType.name === _heroType.name)
        if (!exists) {
            const createdHeroType = HeroTypeSchema.parse({
                id: v4(),
                name: heroType.name
            });
            Store.createHeroType(createdHeroType);
            setTimeout(() => {
                Store.notification.show('Hero Added successfully', 'success')
                Store.modals.addHeroType.setVisibility(false);
            }, 1500);
        } else {
            Store.notification.show('Something went wrong', 'error')
        }
    };

    return (
        <StyledAddHeroTypeView
            component={'form'}
            onSubmit={handleSubmit(submitHeroType => handleAddHeroType(submitHeroType))}
        >
            <StyledFieldContainer>
                <StyledLabel variant={'body2'}>Type name</StyledLabel>
                <TextField
                    size={'small'}
                    error={Boolean(errors.name?.message)}
                    helperText={
                        <Typography variant={'body2'} component={'span'}>
                            {errors.name?.message}
                        </Typography>
                    }
                    {...register('name', {required: true})}
                />
            </StyledFieldContainer>

            <Button
                className={'btnSave'}
                type={'submit'}
                variant="contained"
                bgColor={'#65cd95'}
                textColor={'#fffffff'}
                activeBgColor={'#3e815d'}
                fullWidth
                disabled={Object.keys(errors).length > 0}
            >
                Save Hero type
            </Button>
        </StyledAddHeroTypeView>
    )
};

export default AddHeroTypeView;
