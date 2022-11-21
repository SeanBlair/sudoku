const localStorageKey = 'boardHistory';

export function storageHasHistory() {
  return localStorage.getItem(localStorageKey) !== null;
}

export function getHistoryFromStorage() {
  const boardHistory = localStorage.getItem(localStorageKey);
  return JSON.parse(boardHistory);
}

export function setHistoryInStorage(boardHistory) {
  localStorage.setItem(localStorageKey, JSON.stringify(boardHistory));
}