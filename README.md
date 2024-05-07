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

## API Integration

The hook interacts with the Deck of Cards API to manage the deck. The following API calls are used:

**1. Shuffle New Deck**

```jsx
const response = await shuffleNewDeck(deckCount);
```

- `deckCount` The number of decks to shuffle (default is 1).
- `Response:`
  - `deck_id` The ID of the new deck.

**2. Draw Cards**

```jsx
const response = await drawCards(deckId, count);
```

- `deckId` The ID of the deck to draw from.
- `count` The number of cards to draw.
- `Response:`
  - `cards` An array of drawn cards.

**3. Reshuffle Deck**

```jsx
const response = await reshuffleDeck(deckId, remaining);
```

- `deckId` The ID of the deck to reshuffle.
- `remaining` A boolean indicating whether to only shuffle the remaining cards.

**4. Add to Pile**

```jsx
const response = await addToPile(deckId, pileName, cards);
```

- `deckId` The ID of the deck.
- `pileName` The name of the pile.
- `cards` The codes of the cards to add to the pile.

**5. List and Fetch Pile Cards**

```jsx
const response = await listPileCards(deckId, pileName);
```

- `deckId` The ID of the deck.
- `pileName` The name of the pile.
