import RootStore from './HeroesStore';
export const initialStoreValues = {
    isMobile: false,
    selectedHeroId: '',
    modals: {
        addHero: { visible: false, title: 'Add Hero' },
        heroDetails: { visible: false, title: '' },
    },
    heroes: [],
    heroTypes: [],
    loading: true,
    notification: {
        isVisible: false,
        msg: '',
        type: 'success',
    },
};
const Store = RootStore.create(initialStoreValues);
export default Store;
