import { useState, useEffect } from 'react';

// Hook para ler e escrever no localStorage
function getStorageValue(key, defaultValue) {
  // Pega do storage ou usa o valor padrão
  const saved = localStorage.getItem(key);
  try {
    const initial = JSON.parse(saved);
    return initial || defaultValue;
  } catch (e) {
    // Se o JSON salvo estiver corrompido
    return defaultValue;
  }
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // Salva no localStorage sempre que o valor mudar
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
