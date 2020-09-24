<template>
  <div class="home">
    <h2>Add a recipe</h2>
    <form @submit.prevent="addRecipe">
      <div>
        <button @click="choosePhoto()">Choose a photo</button>
        <input
          type="file"
          ref="inputPhoto"
          style="display: none"
          @change="previewImage"
          accept="image/*"
        />
        <div v-if="imageData!=null">
            <p v-if="uploadValue != 100">{{uploadValue}} %</p>
          <img v-if="uploadValue === 100" class="preview" height="268" width="356" :src="image" />
        </div>
      </div>

      <div>
        <label for="name">Name of the recipe</label>
        <input type="text" name="name" v-model="name" id="name" />
      </div>

      <div>
        <label for="introduction">Introduction</label>
        <textarea name="introduction" v-model="introduction" id="introduction" cols="30" rows="10"></textarea>
      </div>

      <div v-for="(step, index) in steps" :key="index + '-step'">
        <label for="step">Steps:</label>
        <input type="text" name="step" v-model="steps[index]" />
        <i class="material-icons delete" @click="deleteStep(step)">delete</i>
      </div>

      <div>
        <label for="add-step">Add a step (press tab to add):</label>
        <input type="text" name="add-step" @keydown.tab.prevent="addStep" v-model="anotherStep" />
      </div>

      <div>
        <label for="prep_time">Preparation time</label>
        <input type="text" name="prep_time" v-model="prep_time" id="prep_time" />
      </div>

      <div>
        <label for="total_time">Total time</label>
        <input type="text" name="total_time" v-model="total_time" id="total_time" />
      </div>

      <div v-if="this.ingredients.length > 0">
        <h3>Ingredients</h3>
      </div>
      <div v-for="(ing, index) in ingredients" :key="index">
        <p type="text" name="ingredient">
          {{ingredients[index].name}}
          <i class="material-icons delete" @click="deleteIng(ing)">delete</i>
        </p>
      </div>

      <div>
        <label for="add-ingredient">Add an ingredient (press tab to search):</label>
        <input type="text" name="add-ingredient" @keydown.tab.prevent="searchIng" v-model="another" />
        <ul>
          <li v-for="(result, index) in search_results" :key="index">
            <span>{{result.name}}</span>
            <input type="number" label="How much ?" v-model="quantity" />
            <span>{{result.unity}}</span>
            <i class="material-icons delete" @click="addIng(result)">Add</i>
          </li>
        </ul>
        <p v-if="another && searching">There's no ingredient named</p>
      </div>
      <ul>
        <li v-if="calories > 0">Calories: {{calories}}</li>
        <li v-if="proteins > 0">Proteins: {{proteins}}</li>
        <li v-if="fat > 0">Fat: {{fat}}</li>
        <li v-if="carbs > 0">Carbs: {{carbs}}</li>
      </ul>
      <button>Add recipe</button>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import slugify from "slugify";
export default {
  name: "Add",
  data() {
    return {
      name: null,
      introduction: null,
      prep_time: null,
      total_time: null,
      ingredients: [],
      another: null,
      slug: null,
      feedback: null,
      anotherStep: null,
      steps: [],
      search_results: [],
      searching: false,
      proteins: 0,
      calories: 0,
      fat: 0,
      carbs: 0,
      quantity: 0,
      image: null,
      imageData: null,
      uploadValue: 0
    };
  },
  methods: {
    addRecipe() {
      if (this.name) {
        this.slug = slugify(this.name, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true,
        });
        //Save
        db.collection("recipes")
          .add({
            name: this.name,
            slug: this.slug,
            ingredients: this.ingredients,
            prep_steps: this.steps,
            prep_time: this.prep_time,
            total_time: this.total_time,
            image: this.image,
            calories: this.calories
          })
          .then(() => {
            var slug = this.slug;
            this.$router.push({ path: `/recipe/${slug}` });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    searchIng() {
      this.search_results = [];
      this.searching = true;
      if (this.another) {
        let ref = db
          .collection("ingredients")
          .where("name", "==", this.another.toLowerCase());
        ref.get().then((snap) => {
          snap.forEach((element) => {
            this.searching = false;
            var ing = element.data();
            ing.id = element.id;
            this.search_results.push(ing);
          });
        });
      }
    },
    addIng(ing) {
      if (ing) {
        var summIng = {
          name: ing.name,
          quantity: this.quantity,
          id: ing.id,
        };

        ing.quantity = this.quantity;
        this.ingredients.push(summIng);

        this.proteins = this.proteins + ing.proteins * this.quantity;
        this.calories = this.calories + ing.calories * this.quantity;
        this.carbs = this.carbs + ing.carbs * this.quantity;
        this.fat = this.fat + ing.fat * this.quantity;

        this.another = null;
        this.search_results = null;
        this.feedback = null;
        this.quantity = 0;
      } else {
        this.feedback = "You must enter a value to add another ingredient";
      }
    },
    choosePhoto() {
      this.$refs.inputPhoto.click();
    },
    previewImage(event) {
      this.uploadValue = 0;
      this.image = null;
      this.imageData = event.target.files[0];
      this.onUpload();
    },
    onUpload() {
      this.image = null;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.image = url;
          });
        }
      );
    },
    deleteIng(ing) {
      this.proteins = this.proteins - ing.proteins * ing.quantity;
      this.calories = this.calories - ing.calories * ing.quantity;
      this.carbs = this.carbs - ing.carbs * ing.quantity;
      this.fat = this.fat - ing.fat * ing.quantity;
      this.ingredients = this.ingredients.filter((ingredient) => {
        return ingredient != ing;
      });
    },
    addStep() {
      if (this.anotherStep) {
        this.steps.push(this.anotherStep);
        this.anotherStep = null;
        this.feedback = null;
      } else {
        this.feedback = "You must enter a value to add another step";
      }
    },
    deleteStep(step) {
      this.steps = this.steps.filter((ste) => {
        return ste != step;
      });
    },
  },
};
</script>
