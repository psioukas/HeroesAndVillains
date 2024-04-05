import {zodResolver} from '@hookform/resolvers/zod';
import {Box, BoxProps, FormHelperText, MenuItem, Select, TextField, Typography, TypographyProps,} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRef} from 'react';
import {useForm} from 'react-hook-form';
import Store from '../../store';
import {HeroSchema, IHero, IHeroType} from '../../types';
import HeroAvatar from "../hero/HeroAvatar";
import Button from "../Button";

const StyledUpdateHeroView = styled(Box)<BoxProps>(({theme}) => ({
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

const UpdateHeroView = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<IHero>({
        resolver: zodResolver(HeroSchema),
        reValidateMode: 'onBlur',
        mode: 'onBlur',
        values: Store.modals.updateHero.heroToUpdate
    });
    console.log(Store.modals.updateHero.heroToUpdate)
    const typeRef = useRef<HTMLSelectElement>(null);
    const handleUpdateHero = async (heroToUpdate: IHero) => {
        try {
            console.log(`UpdateHeroView.tsx - handleUpdateHero`, heroToUpdate)
            Store.notification.show('Adding hero ...');
            // const createdHero: IHero | undefined = await HeroApiRequests.createHero(heroToCreate);
            const heroType = Store.heroTypes.find((type) => type.id === heroToUpdate.type.id)
            if (!heroType) {
                console.error('Hero type not found!');
            }
            const updatedHero = HeroSchema.parse(heroToUpdate);
            Store.updateHero(updatedHero);
            Store.setSelectedHero(updatedHero.id);
            setTimeout(() => {
                Store.notification.show('Hero updated successfully!', 'success')
                Store.modals.updateHero.setVisibility(false);
            }, 1500)
        } catch (e) {
            Store.notification.show('An error occurred while updating hero', 'error');
        }
    };

    return (
        <StyledUpdateHeroView
            component={'form'}
            onSubmit={handleSubmit(submitHero => handleUpdateHero(submitHero))}
        >
            <HeroAvatar
                src={
                    'https://robohash.org/cade94edf5541f8cf5c03efda775f471?set=set1&bgset=&size=400x400'
                }
                height={94}
                width={94}
            />
            <StyledFieldContainer>
                <StyledLabel variant={'body2'}>Fullname</StyledLabel>
                <TextField
                    size={'small'}
                    error={Boolean(errors.fullName?.message)}
                    helperText={
                        <Typography variant={'body2'} component={'span'}>
                            {errors.fullName?.message}
                        </Typography>
                    }
                    {...register('fullName', {required: true})}
                />
            </StyledFieldContainer>
            <StyledFieldContainer>
                <StyledLabel variant={'body2'}>Avatar Url</StyledLabel>
                <TextField
                    size={'small'}
                    error={Boolean(errors.avatarUrl?.message)}
                    helperText={
                        <Typography variant={'body2'} component={'span'}>
                            {errors.avatarUrl?.message}
                        </Typography>
                    }
                    {...register('avatarUrl')}
                />
            </StyledFieldContainer>
            <StyledFieldContainer>
                <StyledLabel variant={'body2'}>Type</StyledLabel>
                <Select
                    inputRef={typeRef}
                    
                    value={Store.modals.updateHero.heroToUpdate?.type.name ?? ''}
                    {...register('type.id', {required: true})}
                >
                    {Store.heroTypes.map((type: IHeroType) => (
                        <MenuItem
                            key={type.id}
                            value={type.id}
                            onClick={() => {
                                if (typeRef.current) {
                                    typeRef.current.value = type.id;
                                }
                            }}
                        >
                            {type.name}
                        </MenuItem>
                    ))}
                </Select>
                {Boolean(errors.type?.id?.message) && (
                    <FormHelperText error={Boolean(errors.type?.id?.message)}>
                        <Typography variant={'body2'} component={'span'}>
                            {errors.type?.id?.message}
                        </Typography>
                    </FormHelperText>
                )}
            </StyledFieldContainer>
            <StyledFieldContainer>
                <StyledLabel variant={'body2'}>Description</StyledLabel>
                <TextField
                    size={'small'}
                    multiline
                    rows={4}
                    error={Boolean(errors.description?.message)}
                    helperText={
                        <Typography variant={'body2'} component={'span'}>
                            {errors.description?.message}
                        </Typography>
                    }
                    {...register('description')}
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
                Save Hero
            </Button>
        </StyledUpdateHeroView>
    )
};

export default UpdateHeroView;
