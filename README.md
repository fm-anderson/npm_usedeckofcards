# useDeckOfCards

A React hook that provides easy interaction with the [Deck of Cards API](https://deckofcardsapi.com/), allowing you to manage card decks and perform operations like shuffling, drawing, and organizing cards into piles.

## Installation

Install `usedeckofcards` with npm:

```bash
npm install usedeckofcards
```

## TypeScript Support

`usedeckofcards` includes TypeScript type definitions. This is an optional feature and does not affect JavaScript projects. If you are using TypeScript, you will benefit from type safety and IntelliSense.

## Usage

Here's a quick example to get you started:

```jsx
import useDeckOfCards from "usedeckofcards";

function App() {
  const {
    deckId,
    isLoading,
    pileCards,
    cardsRemaining,
    drawAndAddToPile,
    moveCardsBetweenPiles,
    resetGame,
    initializeDeck,
  } = useDeckOfCards();

  const handleDrawCard = () => {
    drawAndAddToPile("discard", 1);
  };

  const handleMoveCards = () => {
    const cards = pileCards.map((card) => card.code).join(",");
    moveCardsBetweenPiles("hand", "discard", cards);
  };

  return (
    <div>
      <h1>Deck ID: {deckId}</h1>
      <p>Cards Remaining: {cardsRemaining}</p>
      <button onClick={handleDrawCard} disabled={isLoading}>
        Draw Card
      </button>
      <button onClick={handleMoveCards} disabled={isLoading}>
        Move Cards
      </button>
      <button onClick={resetGame} disabled={isLoading}>
        Reset Deck
      </button>

      <h2>Pile Cards</h2>
      <div>
        {pileCards.map((card, index) => (
          <div key={index}>
            <img src={card.image} alt={`${card.value} of ${card.suit}`} />
            <p>
              {card.value} of {card.suit}
            </p>
            <p>Pile: {card.pileName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
```

## Hook Return Values

The `useDeckOfCards` hook provides the following values and functions to manage your card deck:

- **deckId:** The ID of the current deck.
  ```typescript
  string | null;
  ```
- **isLoading:** A flag indicating whether an operation is in progress.
  ```typescript
  boolean;
  ```
- **pileCards:** An array of cards in the current pile.
  ```typescript
  Card[]
  ```
- **cardsRemaining:** The number of cards remaining in the deck.
  ```typescript
  number;
  ```
- **drawAndAddToPile:** Draws cards from the deck and adds them to a specified pile.
  ```typescript
  (pileName: string, count?: number) => Promise<void>;
  ```
- **moveCardsBetweenPiles:** Moves cards between piles.
  ```typescript
  (sourcePile: string, targetPile: string, cards: string) => Promise<void>;
  ```
- **resetGame:** Resets the game by reshuffling the deck and clearing the piles.
  ```typescript
  () => Promise<void>;
  ```
- **initializeDeck:** Initializes the deck by fetching deck data and setting up the piles.
  ```typescript
  () => Promise<void>;
  ```
