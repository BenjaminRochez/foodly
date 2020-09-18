<template>
  <div class="recipes">
    <div class="recipes__wrapper" v-if="recipes">
      <router-link
        :to="{ path: `/recipe/${recipe.slug}` }"
        v-for="(recipe, index) in this.recipes"
        :key="index"
        v-bind:style="{ background: recipe.color}"
      >
        <div class="text__wrapper">
          <h3>{{recipe.name}}</h3>
        </div>
        <img :src="recipe.image" />
      </router-link>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";



export default {
  name: "Recipes",
  data() {
    return {
      recipes: [],
    };
  },
  methods: {},
  created() {
    db.collection("recipes")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let recipe = doc.data();
          recipe.id = doc.id;
          this.recipes.push(recipe);
        });
      });
  },
};
</script>
