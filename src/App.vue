<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Recipes</router-link> |
      <router-link to="/cart">Cart</router-link> |
      <router-link to="/add">Add Recipe</router-link> |
      <router-link to="/add-ingredient">Add Ingredients</router-link> |
      <router-link v-if="user" to="/profil">{{user}}</router-link> |
      <a  v-if="user" @click="signOut">Logout</a>
      <Login v-if="!user" />
    </div>
    <router-view />

    <footer></footer>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

import Login from '@/components/Login.vue'
export default {
  components: {
    Login
  },
  data() {
    return {
      user: null,
    };
  },
  methods: {
    signOut(e) {
      e.stopPropagation();
      this.user = null;
      firebase.auth().signOut();
      this.$router.push({
        name: "Login",
      });
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user.displayName;
        this.$store.commit("addUser", user);
      }
    });
  }
};
</script>
