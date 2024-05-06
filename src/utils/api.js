import { saveToLocalStorage } from "./helper";

const baseUrl = "https://deckofcardsapi.com/api/deck";

const fetchAndHandle = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 500) {
        return { success: false, error: "Internal server error" };
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return { success: false, error: error.message };
  }
};

export const shuffleNewDeck = async (deckCount = 1) => {
  const url = `${baseUrl}/new/shuffle/?deck_count=${deckCount}`;
  const data = await fetchAndHandle(url);

  if (data.success) {
    saveToLocalStorage("deckId", data.deck_id);
  }

  return data;
};

export const applyDeckData = async (deckId) => {
  if (!deckId) throw new Error("Invalid deck ID");

  const url = `${baseUrl}/${deckId}`;
  return fetchAndHandle(url);
};

export const drawCards = async (deckId, count = 1) => {
  if (!deckId) throw new Error("Invalid deck ID");

  const url = `${baseUrl}/${deckId}/draw/?count=${count}`;
  return fetchAndHandle(url);
};

export const reshuffleDeck = async (deckId, remaining = false) => {
  const url = `${baseUrl}/${deckId}/shuffle/${remaining ? "?remaining=true" : ""}`;
  return fetchAndHandle(url);
};

export const addToPile = async (deckId, pileName, cards) => {
  const url = `${baseUrl}/${deckId}/pile/${pileName}/add/?cards=${cards}`;
  return fetchAndHandle(url);
};

export const listPileCards = async (deckId, pileName) => {
  if (!deckId) throw new Error("Invalid deck ID");

  const url = `${baseUrl}/${deckId}/pile/${pileName}/list/`;
  return fetchAndHandle(url);
};

export const fetchPileCards = async (deckId, pileName) => {
  const url = `${baseUrl}/${deckId}/pile/${pileName}/list/`;
  const response = await fetchAndHandle(url);

  if (response.success && response.piles[pileName]?.cards) {
    return response.piles[pileName].cards.map((card) => ({
      code: card.code,
      image: card.image,
      value: card.value,
      suit: card.suit,
      pileName,
    }));
  }
  return [];
};

export const initializeDeckWithPile = async (deckCount = 1) => {
  const newDeckData = await shuffleNewDeck(deckCount);
  if (newDeckData.success) {
    await addToPile(newDeckData.deck_id, "discard", "");
    await reshuffleDeck(newDeckData.deck_id);
    return newDeckData;
  }
  return newDeckData;
};
