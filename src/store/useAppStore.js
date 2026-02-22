import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialMeals } from '../data/meals';

export const useAppStore = create(
    persist(
        (set, get) => ({
            meals: initialMeals,
            currentWeekList: Array.from({ length: 7 }).map((_, i) => ({
                id: `empty-${i}`,
                dayIndex: i,
                meal: null,
                note: '',
                customName: ''
            })),
            savedLists: [],
            hasSeenTutorial: false,

            // Tutorial
            completeTutorial: () => set({ hasSeenTutorial: true }),

            // Meals management
            toggleMealStatus: (id) =>
                set((state) => ({
                    meals: state.meals.map((m) =>
                        m.id === id ? { ...m, enabled: !m.enabled } : m
                    ),
                })),

            toggleCategoryStatus: (category, status) =>
                set((state) => ({
                    meals: state.meals.map((m) =>
                        m.category === category ? { ...m, enabled: status } : m
                    ),
                })),

            addMeal: (newMeal) =>
                set((state) => ({
                    meals: [...state.meals, { ...newMeal, id: crypto.randomUUID(), enabled: true }],
                })),

            // Roulette generation
            generateWeek: () => {
                const { meals } = get();
                const availableMeals = meals.filter((m) => m.enabled);

                // Shuffle and pick 7
                const shuffled = [...availableMeals].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 7);

                // If we don't have 7 available, fill the rest with null or duplicates
                const weekList = Array.from({ length: 7 }).map((_, i) => ({
                    id: crypto.randomUUID(), // unique id for the slot
                    dayIndex: i,
                    meal: selected[i] || null,
                    note: '',
                    customName: ''
                }));

                set({ currentWeekList: weekList });
            },

            // Update specific day slot (e.g., custom name, note, or generate specific)
            updateDaySlot: (slotId, updates) =>
                set((state) => ({
                    currentWeekList: state.currentWeekList.map((slot) =>
                        slot.id === slotId ? { ...slot, ...updates } : slot
                    ),
                })),

            regenerateSlot: (slotId) => {
                const { meals, currentWeekList } = get();
                const availableMeals = meals.filter((m) => m.enabled);

                // Pick a random that isn't already in the list
                const currentMealIds = currentWeekList.filter(s => s.meal).map(s => s.meal.id);
                const candidates = availableMeals.filter(m => !currentMealIds.includes(m.id));

                const newMeal = candidates.length > 0
                    ? candidates[Math.floor(Math.random() * candidates.length)]
                    : availableMeals[Math.floor(Math.random() * availableMeals.length)]; // Fallback

                set((state) => ({
                    currentWeekList: state.currentWeekList.map((slot) =>
                        slot.id === slotId ? { ...slot, meal: newMeal, customName: '', note: '' } : slot
                    ),
                }));
            },

            reorderWeekList: (startIndex, endIndex) => {
                set((state) => {
                    const list = Array.from(state.currentWeekList);
                    const [removed] = list.splice(startIndex, 1);
                    list.splice(endIndex, 0, removed);
                    return { currentWeekList: list };
                });
            },

            // Save/history
            saveCurrentList: (name) =>
                set((state) => ({
                    savedLists: [
                        ...state.savedLists,
                        { id: crypto.randomUUID(), name, date: new Date().toISOString(), list: [...state.currentWeekList] },
                    ],
                })),

            deleteSavedList: (id) =>
                set((state) => ({
                    savedLists: state.savedLists.filter(l => l.id !== id),
                })),

            loadSavedList: (id) => {
                const listToLoad = get().savedLists.find(l => l.id === id);
                if (listToLoad) {
                    set({ currentWeekList: [...listToLoad.list] });
                }
            }
        }),
        {
            name: 'ruleta-comidas-storage-v2',
        }
    )
);
