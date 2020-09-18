<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Recipes</router-link> |
      <router-link to="/add">Add Recipe</router-link> |
      <router-link to="/add-ingredient">Add Ingredients</router-link>
    </div>
    <router-view/>

    <footer>
    </footer>
  </div>
</template>
