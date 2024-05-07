# useDeckOfCards

A React hook that provides easy interaction with the [Deck of Cards API](https://deckofcardsapi.com/), allowing you to manage card decks and perform operations like shuffling, drawing, and organizing cards into piles.

## Installation

Install `usedeckofcards` with npm:

```bash
npm install usedeckofcards
```

## Usage

Here's a quick example to get you started:

```jsx
import useDeckOfCards from "usedeckofcards";

function CardGame() {
  const {
    deckId,
    cardsRemaining,
    pileCards,
    drawAndAddToPile,
    resetGame,
    initializeDeck,
  } = useDeckOfCards();

  return (
    <div>
      <h1>Deck ID: {deckId}</h1>
      <p>Cards Remaining: {cardsRemaining}</p>
      <button onClick={() => drawAndAddToPile("discard", 1)}>Draw Card</button>
      <button onClick={resetGame}>Reset Deck</button>
    </div>
  );
}

export default CardGame;
```

## API

The useDeckOfCards hook provides the following data and methods:

- `deckId`: String | null - The current deck's ID.
- `cardsRemaining`: Number - The number of cards remaining in the deck.
- `pileCards`: Array - An array containing the cards currently in the piles.
- `drawAndAddToPile(pileName, count)`: Function - Draws a specified number of cards from the deck and adds them to a pile.
- `resetGame()`: Function - Resets the deck, shuffling all cards back into the deck.
- `initializeDeck()`: Function - Initializes the deck with any stored settings or creates a new deck if none exist.
