<template>
  <div class="home">
    <h2>Add an ingredient</h2>
    <form @submit.prevent="addIng">
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
        <label for="name">Name of the ingredient</label>
        <input type="text" name="name" v-model="name" id="name" />
      </div>

      <div>
        <label for="introduction">Introduction</label>
        <textarea name="introduction" v-model="introduction" id="introduction" cols="30" rows="10"></textarea>
      </div>

      <div>
        <label for="calories">Calories</label>
        <input type="number" name="calories" v-model="calories" id="calories" />
      </div>

      <div>
        <label for="proteins">Proteins</label>
        <input type="number" name="proteins" v-model="proteins" id="proteins" />
      </div>

      <div>
        <label for="fat">Fat</label>
        <input type="number" name="fat" v-model="fat" id="fat" />
      </div>

      <div>
        <label for="carbs">Carbs</label>
        <input type="number" name="carbs" v-model="carbs" id="carbs" />
      </div>

      <button>Add recipe</button>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import slugify from "slugify";
export default {
  name: "AddIng",
  data() {
    return {
      name: null,
      introduction: null,
      slug: null,
      feedback: null,
      proteins: 0,
      calories: 0,
      fat: 0,
      carbs: 0,
    };
  },
  methods: {
    addIng() {
      if (this.name) {
        this.slug = slugify(this.name, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true,
        });
        //Save
        db.collection("ingredients")
          .add({
            name: this.name,
            slug: this.slug,
            introduction: this.introduction,
            calories: this.calories,
            proteins: this.proteins,
            fat: this.fat,
            carbs: this.carbs,
            image: this.image,
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
  },
};
</script>
