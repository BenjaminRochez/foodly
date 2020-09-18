<template>
  <div class="cart">
    <h2>Cart</h2>
    <p>{{cart}}</p>
    <ul>
      <li v-for="(ing, index) in ingredients" :key="index">{{ing.name}} - {{ing.quantity}}</li>
    </ul>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "Cart",
  data() {
    return {
      cart: [],
      ingredients: [],
    };
  },
  methods: {},
  created() {
    db.collection("carts")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let cart = doc.data();
          cart.id = doc.id;
          this.cart.push(cart);
          cart.ingredients.forEach((ing) => {
            this.ingredients.push(ing);
          });
        });
      });
  },
};
</script>
