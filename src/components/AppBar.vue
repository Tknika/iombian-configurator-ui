<template>
  <div>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>
          {{ appName }}
        </h2>
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="needRefresh" text color="yellow" @click="updateServiceWorker">{{reloadText}}</v-btn>
      <v-btn v-if="userId && !$vuetify.breakpoint.xs" text @click="logoutUser">{{ logOutText }}<v-icon right>mdi-logout</v-icon></v-btn>
      <v-btn v-if="userId && $vuetify.breakpoint.xs" icon @click="logoutUser"><v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import useRegisterSW from '@/mixins/useRegisterSW'

export default {
  mixins: [useRegisterSW],
  data: () => ({
    appName: "IoMBian Configurator",
    logOutText: "Log Out",
    reloadText: "Reload",
    reloadMessage: "New content available, click on reload button to update."
  }),
  computed: {
    userId() {
      return this.$store.state.user.id;
    }
  },
  methods: {
    async logoutUser() {
      if (this.$store.state.user.refreshToken == '') {
        this.$store.dispatch("user/deleteUserData");
        await firebase.auth().currentUser.delete();
      } else {
        await firebase.auth().signOut();
      }
      this.$store.dispatch("user/clearUserData");
      this.$router.replace({ name: "SignIn" });
    },
  },
};
</script>