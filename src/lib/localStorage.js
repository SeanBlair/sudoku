// Todo: These could all go in a separate file
const localStorageKey = 'boardHistory';

export function localStorageHasBoardHistory() {
  return localStorage.getItem(localStorageKey) !== null;
}

export function getBoardHistoryFromLocalStorage() {
  const boardHistory = localStorage.getItem(localStorageKey);
  return JSON.parse(boardHistory);
}

export function setBoardHistoryInLocalStorage(boardHistory) {
  localStorage.setItem(localStorageKey, JSON.stringify(boardHistory));
}