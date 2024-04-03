import Store from '../store';
import { CreateHeroType, IHero, IHeroesListResponse, IHeroType } from '../types/index';
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

export async function createHero(hero: CreateHeroType): Promise<IHero | undefined> {
    try {
        showInfoNotification(`Please wait creating hero ${hero.fullName}`);
        const url = constructURL('heroes');
        const responseHero = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(hero),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!responseHero.ok) {
            showErrorNotification();
            return undefined;
        }
        const result:IHero = await responseHero.json();

        showSuccessNotification('Succesfully created hero.');
        return result;
    } catch (error) {
        showErrorNotification();
        return undefined;
    }
}

export async function deleteHero(heroId?: string): Promise<boolean> {
    Store.notification.show('Please wait deleting hero', 'info');
    if (!heroId || !heroId.trim() || !baseApiUrl) {
        return false;
    }
    try {
        const deleteURL = constructURL(`heroes/${heroId}`);
        await fetch(deleteURL, { method: 'DELETE' });
        Store.notification.show('Hero deleted successfully', 'success');
    } catch (error) {
        showErrorNotification();
        return false;
    }
    return true;
}

export async function getSpecificHero(heroId?: string): Promise<IHero | undefined> {
    if (!baseApiUrl) return undefined;
    try {
        const specificHeroURL = constructURL(`heroes/${heroId}`);
        const response = await fetch(specificHeroURL);
        const hero: IHero & {typeId:string} = await response.json();
        return {
            id: hero.id,
            fullName: hero.fullName,
            avatarUrl: hero.avatarUrl,
            type: hero.type,
            description: hero.description
        };
    } catch (e) {
        showErrorNotification();
        return undefined;
    }
}

export async function getHeroesList(): Promise<IHero[]> {
    if (!baseApiUrl) return Promise.reject([]);
    const heroesListURL = constructURL('heroes');
    const response = await fetch(heroesListURL);
    const heroesListResponse: IHeroesListResponse = await response.json();
    return heroesListResponse.data;
}

export async function updateHero(hero: IHero): Promise<IHero | undefined> {
    try {
        showInfoNotification(`Please wait updating hero ${hero.fullName}`);
        const url = constructURL('heroes');
        const { id, avatarUrl, description } = hero;

        const responseHero = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                id,
                avatarUrl,
                description,
                typeId: hero.type,
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        const result: IHero = await responseHero.json();
        showSuccessNotification('Succesfully updated hero.');
        return result;
    } catch (error) {
        showErrorNotification();
        return undefined;
    }
}

export async function getTypes(): Promise<IHeroType[]> {
    if (!baseApiUrl) return Promise.reject([]);
    const typesUrl = constructURL('types');
    const response = await fetch(typesUrl);
    const typesList: IHeroType[] = await response.json();
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
const HeroApiRequests = {
    getHeroesList,
    getSpecificHero,
    createHero,
    deleteHero,
    updateHero,
    getTypes,
};
export default HeroApiRequests;
