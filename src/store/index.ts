import RootStore from './CharactersStore'
import { v4 } from 'uuid'

const valuesFromLocalStorage = {
    characterTypes: () => {
        try {
            const localStorageCharactersTypes =
                localStorage.getItem('characterTypes')
            if (localStorageCharactersTypes !== null)
                return JSON.parse(localStorageCharactersTypes)
        } catch (e) {
            console.error('Error getting character types from local storage', e)
        }
        return undefined
    },
    characters: () => {
        try {
            const localStorageCharacters = localStorage.getItem('characters')
            if (localStorageCharacters !== null)
                return JSON.parse(localStorageCharacters)
        } catch (e) {
            console.error('Error getting character from local storage', e)
        }
        return undefined
    },
} as const
export const initialStoreValues = {
    isMobile: false,
    selectedCharacterId: '',
    characters: valuesFromLocalStorage.characters(),
    characterTypes: valuesFromLocalStorage.characterTypes() ?? [
        { id: v4(), name: 'Character' },
        {
            id: v4(),
            name: 'Villain',
        },
    ],
    loading: true,
    notification: {
        isVisible: false,
        msg: '',
        type: 'success',
    },
    fatalError: undefined,
}
const Store = RootStore.create(initialStoreValues)
export default Store
