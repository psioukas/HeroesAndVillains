import { zodResolver } from '@hookform/resolvers/zod'
import {
    Box,
    BoxProps,
    FormHelperText,
    MenuItem,
    Select,
    TextField,
    Typography,
    TypographyProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import Store from '../../store'
import { CharacterSchema, ICharacter, ICharacterType } from '../../types'
import CharacterAvatar from '../character/CharacterAvatar'
import Button from '../Button'

const StyledUpdateCharacterView = styled(Box)<BoxProps>(({ theme }) => ({
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
}))

const StyledLabel = styled(Typography)<TypographyProps>(() => ({
    color: '#93969e',
}))

const StyledFieldContainer = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
}))

const UpdateCharacterView = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ICharacter>({
        resolver: zodResolver(CharacterSchema),
        reValidateMode: 'onBlur',
        mode: 'onBlur',
        values: Store.modals.character.update.characterToUpdate,
    })
    console.log(Store.modals.character.update.characterToUpdate)
    const typeRef = useRef<HTMLSelectElement>(null)
    const handleUpdateCharacter = async (characterToUpdate: ICharacter) => {
        try {
            console.log(
                `UpdateCharacterView.tsx - handleUpdateCharacter`,
                characterToUpdate
            )
            Store.notification.show('Updating character ...')
            const characterType = Store.characterTypes.find(
                (type) => type.id === characterToUpdate.type.id
            )
            if (!characterType) {
                Store.notification.show(
                    'Character update failed, character type not found.',
                    'error'
                )
            }
            const updatedCharacter = CharacterSchema.parse(characterToUpdate)
            Store.updateCharacter(updatedCharacter)
            Store.setSelectedCharacter(updatedCharacter.id)
            Store.notification.show(
                'Character updated successfully!',
                'success'
            )
        } catch (e) {
            Store.notification.show(
                'An error occurred while updating character',
                'error'
            )
        } finally {
            Store.modals.character.update.setVisibility(false)
        }
    }

    return (
        <StyledUpdateCharacterView
            component={'form'}
            onSubmit={handleSubmit((submitCharacter) =>
                handleUpdateCharacter(submitCharacter)
            )}
        >
            <CharacterAvatar
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
                    defaultValue={
                        Store.modals.character.update.characterToUpdate?.type
                            .id ?? ''
                    }
                    {...register('type.id', { required: true })}
                >
                    {Store.characterTypes.map((type: ICharacterType) => (
                        <MenuItem
                            key={type.id}
                            value={type.id}
                            onClick={() => {
                                if (typeRef.current) {
                                    typeRef.current.value = type.id
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
                Save Character
            </Button>
        </StyledUpdateCharacterView>
    )
}

export default UpdateCharacterView
