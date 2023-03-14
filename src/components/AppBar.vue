<template>
  <div>
    <v-app-bar app color="#233167" dark>
      <v-toolbar-title><h3>{{ appName }}</h3></v-toolbar-title>
      <v-btn v-if="pwaInstallPrompt && !$vuetify.breakpoint.xs" class="ml-2" icon @click="installPWA"><v-icon>mdi-monitor-arrow-down</v-icon></v-btn>
      <v-btn v-if="pwaInstallPrompt && $vuetify.breakpoint.xs" class="ml-2" icon @click="installPWA"><v-icon>mdi-cellphone-arrow-down</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="needRefresh && !$vuetify.breakpoint.xs" text @click="updateServiceWorker">{{reloadText}}<v-icon right>mdi-reload-alert</v-icon></v-btn>
      <v-btn v-if="needRefresh && $vuetify.breakpoint.xs" icon @click="updateServiceWorker"><v-icon>mdi-reload-alert</v-icon></v-btn>
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
    reloadMessage: "New content available, click on reload button to update.",
    pwaInstallPrompt: null,
  }),
  created() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      this.pwaInstallPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.pwaInstallPrompt = null;
    });
  },
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
    async installPWA() {
      this.pwaInstallPrompt.prompt();
    },
  },
};
</script>