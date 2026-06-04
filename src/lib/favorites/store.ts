"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  ids: number[];
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      isFavorite: (id) => get().ids.includes(id),
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((existing) => existing !== id)
            : [...state.ids, id],
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: "shoply:favorites" },
  ),
);
