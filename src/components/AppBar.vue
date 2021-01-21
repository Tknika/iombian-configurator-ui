<template>
  <div>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>
          IoMBian Configurator
        </h2>
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="userId && !$vuetify.breakpoint.xs" text @click="logoutUser">Log Out<v-icon right>mdi-logout</v-icon></v-btn>
      <v-btn v-if="userId && $vuetify.breakpoint.xs" icon @click="logoutUser"><v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  computed: {
    userId() {
      return this.$store.state.user.id;
    }
  },
  methods: {
    async logoutUser() {
      await firebase.auth().signOut();
      this.$store.dispatch("user/clearUserData");
      this.$router.replace("/");
    },
  },
};
</script>