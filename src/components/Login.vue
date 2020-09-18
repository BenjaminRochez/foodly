<template>
  <div>
    <section id="firebaseui-auth-container"></section>
  </div>
</template>

<script>
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "Login",
  data() {
    return {
        user: null
    };
  },

  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    var uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      signInFlow: "popup",
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>