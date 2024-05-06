export function saveToLocalStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);

    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error storing data in localStorage:", error);
  }
}

export function getFromLocalStorage(key) {
  try {
    const serializedData = localStorage.getItem(key);

    if (serializedData === null) {
      console.error("No data found for key:", key);
      return null;
    }

    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error parsing data from localStorage:", error);
    return null;
  }
}

export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data from localStorage:", error);
  }
}
