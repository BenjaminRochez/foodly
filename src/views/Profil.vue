<template>
  <div class="profil">
    <h2>Profil</h2>

    <p>Nom utilisateur : {{this.$store.state.user.displayName}}</p>
    <p>Email : {{this.$store.state.user.email}}</p>
    <p>Date de création : {{this.$store.state.user.metadata.creationTime}}</p>
    <img :src="$store.state.user.photoURL" />
  </div>
</template>

<script>


export default {
  name: 'Profil',
  methods: {
  },
  created(){
      console.log(this.$store.state.user);
  }
}
</script>
