<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import db from "@/firebase/init";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    getData: function(){
      db.collection('test')
      .get()
      .then(snapshot =>{
        snapshot.forEach(doc =>{
          console.log(doc.data());
        })
      })
    }
  },
  created(){
    this.getData();
  }
}
</script>
