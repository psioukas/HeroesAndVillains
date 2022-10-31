import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import HeroDetailsView from '../components/modal/HeroDetailsView';
import Modals from '../components/modal/Modals';
import Store from '../store';
import { IHero } from '../types';
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const hero: IHero = {
    id: 'whatever-id',
    avatarUrl: 'http://www.google.com/images/wtv',
    fullName: 'Full Metal',
    type: {
        id: 'id-human',
        name: 'human',
    },
    description: 'dangerous',
};

const mockedFetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
    }),
) as jest.Mock;

global.fetch = mockedFetch;

beforeEach(() => {
    Store.addHero(hero);
    Store.showHeroDetails(hero.id);
});
afterEach(() => {
    Store.clearSelectedHero();
    Store.deleteHero(hero);
});

test('Expect Snapshot to match', () => {
    const domTree = renderer.create(<HeroDetailsView />).toJSON();
    expect(domTree).toMatchSnapshot();
});
test('Renders Hero Details', () => {
    render(<Modals />);
    const heroDetailsView = screen.getByTestId('hero-details-view');
    expect(heroDetailsView).toBeInTheDocument();
});

test('Click Modal close button, should close Hero Details view', () => {
    render(<Modals />);
    const heroDetailsView = screen.getByTestId('hero-details-view');
    expect(heroDetailsView).toBeInTheDocument();

    const button = screen.getByTestId('close-button');
    expect(button).toBeInTheDocument();

    userEvent.click(button);

    const activeModalTitle = Store.modals.activeModalTitle;
    const heroDetailsVisible = Store.modals.heroDetails.visible;

    expect(activeModalTitle).toBe('');
    expect(heroDetailsVisible).toBe(false);
});
test('Check hero details are in the view', () => {
    render(<HeroDetailsView />);
    const fullNameText = screen.getByText(hero.fullName);
    const descriptionText = screen.getByText(hero.description);
    expect(fullNameText).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
});
