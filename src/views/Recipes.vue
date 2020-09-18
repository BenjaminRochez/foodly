<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div v-if="recipes">
    
    <ul>
        
        <li v-for="(recipe, index) in this.recipes" :key="index">
             <router-link :to="{ path: `/recipe/${recipe.slug}` }">
                {{recipe.name}}
            </router-link>
            
        </li>
    </ul>

    </div>
  </div>
</template>

<script>

import db from "@/firebase/init";
 
export default {
  name: 'Recipes',
  data(){
      return{
          recipes: []
      }
  },
  methods: {
    
  },
  created(){
    db.collection('recipes').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let recipe = doc.data()
        recipe.id = doc.id
        this.recipes.push(recipe)
      })
    })
  }
}
</script>
