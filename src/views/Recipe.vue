<template>
  <div class="recipe">
    <div v-if="recipe">
      <div class="recipe__hero">
        <h1>{{ recipe.name }}</h1>
        <img :src="recipe.image" />
      </div>
      <h2 class="recipe__intro">{{ recipe.introduction }}</h2>

      <div class="recipe__content">
        <div class="recipe__ingredients">
          <h2>Ingredients</h2>

          <div class="nutrition">
            <ul>
              <li>
                <img alt="Vue logo" src="../assets/calories.png" />
                <span>{{calories}}</span>
              </li>
              <li>
                <img alt="Vue logo" src="../assets/proteins.png" />
                <span>{{proteins}}</span>
              </li>

              <li>
                <img alt="Vue logo" src="../assets/fat.png" />
                <span>{{fat}}</span>
              </li>
              <li>
                <img alt="Vue logo" src="../assets/carbs.png" />
                <span>{{carbs}}</span>
              </li>
            </ul>
          </div>
          <table>
            <tbody>
              <tr v-for="(ing, index) in ingredients" :key="index">
                <td>{{ing.quantity}} {{ing.unity}}</td>
                <td>{{ing.name}}</td>
              </tr>
            </tbody>
          </table>
          <div class="bag" @click="fillCart">
            Add to the shopping list
          </div>
        </div>

        <div class="recipe__method">
          <div class="heading__wrapper">
            <h2>Method</h2>
            <div class="recipe__meta">
              <span class="prep_time">{{recipe.prep_time}}</span>
              <span class="total_time">{{recipe.total_time}}</span>
              <span class="servings">2</span>
            </div>
          </div>
          <ul>
            <li v-for="(step, index) in this.recipe.prep_steps" :key="index">
              <span class="recipe__step">Step {{index + 1}}</span>
              {{step}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "Recipe",
  data() {
    return {
      recipe: null,
      ingredients: [],
      calories: 0,
      fat: 0,
      proteins: 0,
      carbs: 0,
      cart: [],
      detectCart: false
    };
  },
  methods: {
    getIngredients: function () {
      this.recipe.ingredients.forEach((ing) => {
        let docRef = db.collection("ingredients").doc(ing.id);
        docRef.get().then((doc) => {
          var ingredient = doc.data();
          ingredient.quantity = ing.quantity;
          ingredient.id = doc.id;
          this.calories = this.calories + ingredient.calories * ing.quantity;
          this.proteins = this.proteins + ingredient.proteins * ing.quantity;
          this.carbs = this.carbs + ingredient.carbs * ing.quantity;
          this.fat = this.fat + ingredient.fat * ing.quantity;
          this.ingredients.push(ingredient);
        });
      });
    },
    fillCart: function(){
    }
  },
  created() {
    let ref = db
      .collection("recipes")
      .where("slug", "==", this.$route.params.recipe_slug);
    ref.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        this.recipe = doc.data();
        this.recipe.id = doc.id;
        console.log(this.recipe);
        this.getIngredients();
      });
    });
  }
};
</script>
