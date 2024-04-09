import RootStore from './CharactersStore';
import {v4} from "uuid";

const valuesFromSessionStorage = {
    characterTypes: () => {
        try {
            const sessionStorageCharacterTypes = sessionStorage.getItem('characterTypes');
            if (sessionStorageCharacterTypes !== null)
                return JSON.parse(sessionStorageCharacterTypes);
        } catch (e) {
            console.error('Error getting character types from local storage', e);
        }
        return undefined;
    },
    character: () => {
        try {
            const sessionStorageCharacter = sessionStorage.getItem('character');
            if (sessionStorageCharacter !== null)
                return JSON.parse(sessionStorageCharacter);
        } catch (e) {
            console.error('Error getting character from local storage', e);
        }
        return undefined;
    }
} as const;
export const initialStoreValues = {
    isMobile: false,
    selectedCharacterId: '',
    modals: {
        addCharacter: {visible: false, title: 'Add Character'},
        characterDetails: {visible: false, title: ''},
    },
    character: valuesFromSessionStorage.character(),
    characterTypes: valuesFromSessionStorage.characterTypes() ?? [{id: v4(), name: 'Character'}, {
        id: v4(),
        name: 'Villain'
    }],
    loading: true,
    notification: {
        isVisible: false,
        msg: '',
        type: 'success',
    },
};
const Store = RootStore.create(initialStoreValues);
export default Store;
