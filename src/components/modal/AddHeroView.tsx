import {zodResolver} from '@hookform/resolvers/zod';
import {Box, BoxProps, FormHelperText, MenuItem, Select, TextField, Typography, TypographyProps,} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRef} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import Store from '../../store';
import {CreateHeroType, HeroSchema, IHeroType} from '../../types';
import {v4} from 'uuid';
import HeroAvatar from "../hero/HeroAvatar";
import Button from "../Button";

const StyledAddHeroView = styled(Box)<BoxProps>(({ theme }) => ({
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

const StyledLabel = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: '#93969e',
}));
const StyledFieldContainer = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
}));
const CreateHeroSchema = z.object({
    fullName: z.string({ required_error: 'Required' }).min(1, { message: 'Required' }),
    avatarUrl: z.string(),
    typeId: z.string({ required_error: 'Required' }).min(1, { message: 'Required' }),
    description: z.string(),
});

type CreateHeroSchemaType = z.infer<typeof CreateHeroSchema>;

const AddHeroView = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateHeroSchemaType>({
        resolver: zodResolver(CreateHeroSchema),
        reValidateMode: 'onBlur',
        mode: 'onBlur',
    });
    const typeRef = useRef<HTMLSelectElement>(null);
    const handleAddHero = async (heroToCreate: CreateHeroType) => {
        Store.setLoading(true);
        // const createdHero: IHero | undefined = await HeroApiRequests.createHero(heroToCreate);
        const heroType = Store.heroTypes.find((type) => type.id === heroToCreate.typeId)
        if (!heroType) {
            console.error('Hero type not found!');
        }
        const createdHero = HeroSchema.parse({
            id: v4(),
            type: heroType,
            ...heroToCreate
        })
            Store.addHero(createdHero);
            Store.setSelectedHero(createdHero.id);
        setTimeout(() => {
            Store.setLoading(false);
            Store.modals.addHero.setVisibility(false);
        }, 1500)
    };

    return (
        <StyledAddHeroView
            component={'form'}
            onSubmit={handleSubmit(submitHero => handleAddHero(submitHero))}
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
                    {...register('fullName', { required: true })}
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
                    defaultValue={''}
                    {...register('typeId', { required: true })}
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
                {Boolean(errors.typeId?.message) && (
                    <FormHelperText error={Boolean(errors.typeId?.message)}>
                        <Typography variant={'body2'} component={'span'}>
                            {errors.typeId?.message}
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
        </StyledAddHeroView>
    )
};

export default AddHeroView;
