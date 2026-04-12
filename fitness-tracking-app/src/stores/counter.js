import { defineStore } from 'pinia'

/*
    Store that holds the information about food data for the pages
    and views to use

    State is the data that it holds

    Actions are the get, set and logic functions for it
*/
export const useFoodStore = defineStore('food', {
  state: () => ({
    meals: [],
    totalCalories: 0,
  }),

  actions: {
    addMeal(meal) {
      this.meals.push(meal)
      this.totalCalories += meal.calories
    },
  },
})
