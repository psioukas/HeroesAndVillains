import Store from '../store';
import {CreateCharacterType, ICharacter, ICharacterListResponse, ICharacterType} from '../types';

export const baseApiUrl: string | undefined = process.env.REACT_APP_API_BASE_URL;

const showInfoNotification = (msg: string) => {
    Store.notification.show(msg, 'info');
};
const showSuccessNotification = (msg: string) => {
    Store.notification.show(msg, 'success');
};
const showErrorNotification = () => {
    Store.notification.show('Something went wrong. Please try again.', 'error');
};

export async function createCharacter(character: CreateCharacterType): Promise<ICharacter | undefined> {
    try {
        showInfoNotification(`Please wait creating character ${character.fullName}`);
        const url = constructURL('character');
        const responseCharacter = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(character),
            headers: {'Content-Type': 'application/json'},
        });
        if (!responseCharacter.ok) {
            showErrorNotification();
            return undefined;
        }
        const result: ICharacter = await responseCharacter.json();

        showSuccessNotification('Succesfully created character.');
        return result;
    } catch (error) {
        showErrorNotification();
        return undefined;
    }
}

export async function deleteCharacter(characterId?: string): Promise<boolean> {
    Store.notification.show('Please wait deleting character', 'info');
    if (!characterId || !characterId.trim() || !baseApiUrl) {
        return false;
    }
    try {
        const deleteURL = constructURL(`character/${characterId}`);
        await fetch(deleteURL, {method: 'DELETE'});
        Store.notification.show('Character deleted successfully', 'success');
    } catch (error) {
        showErrorNotification();
        return false;
    }
    return true;
}

export async function getSpecificCharacter(characterId?: string): Promise<ICharacter | undefined> {
    if (!baseApiUrl) return undefined;
    try {
        const specificCharacterURL = constructURL(`character/${characterId}`);
        const response = await fetch(specificCharacterURL);
        const character: ICharacter & { typeId: string } = await response.json();
        return {
            id: character.id,
            fullName: character.fullName,
            avatarUrl: character.avatarUrl,
            type: character.type,
            description: character.description
        };
    } catch (e) {
        showErrorNotification();
        return undefined;
    }
}

export async function getCharacterList(): Promise<ICharacter[]> {
    if (!baseApiUrl) return Promise.reject([]);
    const characterListURL = constructURL('character');
    const response = await fetch(characterListURL);
    const characterListResponse: ICharacterListResponse = await response.json();
    return characterListResponse.data;
}

export async function updateCharacter(character: ICharacter): Promise<ICharacter | undefined> {
    try {
        showInfoNotification(`Please wait updating character ${character.fullName}`);
        const url = constructURL('character');
        const {id, avatarUrl, description} = character;

        const responseCharacter = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                id,
                avatarUrl,
                description,
                typeId: character.type,
            }),
            headers: {'Content-Type': 'application/json'},
        });
        const result: ICharacter = await responseCharacter.json();
        showSuccessNotification('Succesfully updated character.');
        return result;
    } catch (error) {
        showErrorNotification();
        return undefined;
    }
}

export async function getTypes(): Promise<ICharacterType[]> {
    if (!baseApiUrl) return Promise.reject([]);
    const typesUrl = constructURL('types');
    const response = await fetch(typesUrl);
    const typesList: ICharacterType[] = await response.json();
    return typesList;
}

function constructURL(endpoint?: string) {
    if (!baseApiUrl) return '';
    try {
        const url = new URL(`${baseApiUrl}/${endpoint}`);
        return url;
    } catch (error) {
        return `${baseApiUrl}/${endpoint}`;
    }
}

const CharacterApiRequests = {
    getCharacterList,
    getSpecificCharacter,
    createCharacter,
    deleteCharacter,
    updateCharacter,
    getTypes,
};
export default CharacterApiRequests;
