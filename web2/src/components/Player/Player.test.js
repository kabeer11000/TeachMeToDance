import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Player from './Player';

describe('<Player />', () => {
  test('it should mount', () => {
    render(<Player/>);

    const player = screen.getByTestId('Player');

    expect(player).toBeInTheDocument();
  });
});
