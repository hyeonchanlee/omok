import React, { createContext } from 'react';

const GameContext = createContext(null);

const withGame = Component => props => (
    <GameContext.Consumer>
        {game => 
            <Component {...props} game={game} />
        }
    </GameContext.Consumer>
);

export { GameContext, withGame };