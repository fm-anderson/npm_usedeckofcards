declare module "useDeckOfCards" {
  export interface CardImages {
    svg: string;
    png: string;
  }

  export interface Card {
    code: string;
    image: string;
    images: CardImages;
    value: string;
    suit: string;
    pileName?: string;
  }

  export interface UseDeckOfCards {
    deckId: string | null;
    isLoading: boolean;
    pileCards: Card[];
    cardsRemaining: number;
    moveCardsBetweenPiles: (
      sourcePile: string,
      targetPile: string,
      cards: string
    ) => Promise<void>;
    drawAndAddToPile: (pileName: string, count?: number) => Promise<void>;
    initializeDeck: () => Promise<void>;
    resetGame: () => Promise<void>;
  }

  const useDeckOfCards: () => UseDeckOfCards;

  export default useDeckOfCards;
}
