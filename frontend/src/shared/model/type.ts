import { createStore, createEvent } from 'effector';

export interface Student {
    id: number;
    name: string;
    group: string;
    phone: string;
    email: string;
    verified: boolean;
    createdAt: string;
  }

  // Создаём событие для изменения состояния
  export const toggleVerified = createEvent<boolean>();
  
  // Создаём store, который слушает событие
  export const $verified = createStore(false)
    .on(toggleVerified, (_, payload) => payload);


// Событие для изменения активного меню
export const setActiveMenu = createEvent<string | null>();

// Стор для хранения текущего активного меню
export const $activeMenu = createStore<string | null>(null)
  .on(setActiveMenu, (_, menuId) => menuId); // Устанавливаем id активного меню



