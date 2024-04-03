import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import HeroListItem from '../components/hero/HeroListItem';
import Store from '../store/index';
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

test('Renders Hero List Item', () => {
    Store.addHero(hero);
    Store.setSelectedHero(hero.id);
    const domTree = renderer.create(<HeroListItem hero={hero} />).toJSON();
    expect(domTree).toMatchSnapshot();
});

test('Renders Hero List Item find elements', () => {
    render(<HeroListItem hero={hero} />);
    const fullNameText = screen.getByText(hero.fullName);
    const descriptionText = screen.getByText(hero.description);

    expect(fullNameText).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
});
