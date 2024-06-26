import { useState, useCallback, useEffect } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "./utils/helper";
import {
  applyDeckData,
  reshuffleDeck,
  drawFromMainDeck,
  addToPile,
  listPileCards,
  initializeDeckWithPile,
  fetchPileCards,
  drawFromPile,
} from "./utils/api";

function useDeckOfCards() {
  const [deckId, setDeckId] = useState(getFromLocalStorage("deckId") || null);
  const [cardsRemaining, setCardsRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pileCards, setPileCards] = useState([]);

  const updateDeck = useCallback((deckData) => {
    if (deckData && deckData.success) {
      setDeckId(deckData.deck_id);
      setCardsRemaining(deckData.remaining);
      saveToLocalStorage("deckId", deckData.deck_id);
    }
  }, []);

  const updatePiles = useCallback(async (deckId, pileNames) => {
    setIsLoading(true);
    const updatedPileCards = [];

    for (const pileName of Object.keys(pileNames.piles)) {
      const cards = await fetchPileCards(deckId, pileName);
      updatedPileCards.push(...cards);
    }
    setPileCards(updatedPileCards);
    setIsLoading(false);
  }, []);

  const createNewDeck = useCallback(async () => {
    setIsLoading(true);

    const deckData = await initializeDeckWithPile();
    updateDeck(deckData);
    setIsLoading(false);
  }, []);

  const initializeDeck = useCallback(async () => {
    setIsLoading(true);

    try {
      const deckData = await applyDeckData(deckId);
      updateDeck(deckData);
      const pileNames = await listPileCards(deckId);

      if (pileNames.success) {
        if (Object.keys(pileNames.piles).length > 0) {
          updatePiles(deckId, pileNames);
        } else {
          console.warn("No piles to update.");
        }
      } else {
        console.warn("Invalid pile data received.");
      }
    } catch (error) {
      console.error("Failed to initialize deck:", error);
    } finally {
      setIsLoading(false);
    }
  }, [deckId, updateDeck]);

  const drawAndAddToPile = useCallback(
    async (pileName, count = 1) => {
      setIsLoading(true);
      pileName = pileName || "discard";

      if (!deckId || isLoading) {
        console.warn(
          "Action skipped: no deck ID or operation is currently loading."
        );
        return;
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(pileName)) {
        console.warn(
          "Invalid pile name: The pile name must consist only of alphanumeric characters without any spaces or special characters."
        );
        return;
      }

      try {
        const result = await drawFromMainDeck(deckId, count);

        if (result.success) {
          setCardsRemaining(result.remaining);
          const cardCodes = result.cards.map((card) => card.code).join(",");
          const addToPileResult = await addToPile(deckId, pileName, cardCodes);

          if (addToPileResult.success) {
            const updatedPileCards = await listPileCards(deckId, pileName);

            if (updatedPileCards.success) {
              setPileCards((prev) => [
                ...prev.filter((card) => card.pileName !== pileName),
                ...updatedPileCards.piles[pileName].cards.map((card) => ({
                  ...card,
                  pileName,
                })),
              ]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to draw and add to pile:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [deckId, isLoading]
  );

  const moveCardsBetweenPiles = useCallback(
    async (sourcePile, targetPile, cards) => {
      setIsLoading(true);

      if (!deckId || isLoading) {
        console.warn(
          "Action skipped: no deck ID or operation is currently loading."
        );
        return;
      }

      try {
        const drawResult = await drawFromPile(deckId, sourcePile, cards);

        if (drawResult.success && drawResult.cards.length > 0) {
          const drawnCards = drawResult.cards
            .map((card) => card.code)
            .join(",");

          const addToPileResult = await addToPile(
            deckId,
            targetPile,
            drawnCards
          );

          if (addToPileResult.success) {
            const updatedSourcePile = await listPileCards(deckId, sourcePile);
            const updatedTargetPile = await listPileCards(deckId, targetPile);

            setPileCards((prev) => [
              ...prev.filter(
                (card) =>
                  card.pileName !== sourcePile && card.pileName !== targetPile
              ),
              ...updatedSourcePile.piles[sourcePile].cards.map((card) => ({
                ...card,
                pileName: sourcePile,
              })),
              ...updatedTargetPile.piles[targetPile].cards.map((card) => ({
                ...card,
                pileName: targetPile,
              })),
            ]);
          } else {
            console.warn(
              "Failed to add cards to the target pile:",
              addToPileResult.error
            );
          }
        } else {
          console.warn(
            "Failed to draw cards from the source pile:",
            drawResult.error
          );
        }
      } catch (error) {
        console.error("Failed to move cards between piles:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [deckId, isLoading]
  );

  const resetGame = useCallback(async () => {
    if (!deckId) {
      createNewDeck();
      return;
    } else {
      try {
        setIsLoading(true);
        const response = await reshuffleDeck(deckId);
        if (response.success) {
          setCardsRemaining(response.remaining);
          setPileCards([]);
        }
      } catch (error) {
        console.error("Failed to reset game:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [deckId]);

  useEffect(() => {
    setIsLoading(true);
    const storedDeckId = getFromLocalStorage("deckId");

    if (!storedDeckId) {
      createNewDeck();
      setIsLoading(false);
    } else {
      initializeDeck();
      setIsLoading(false);
    }
  }, []);

  return {
    deckId,
    isLoading,
    pileCards,
    cardsRemaining,
    moveCardsBetweenPiles,
    drawAndAddToPile,
    initializeDeck,
    resetGame,
  };
}

export default useDeckOfCards;
