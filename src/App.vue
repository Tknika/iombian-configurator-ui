<template>
  <v-app>
    <ReloadPrompt />
    <AppBar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import ReloadPrompt from "./components/ReloadPrompt.vue";
import AppBar from "./components/AppBar.vue";

export default {
  name: "App",

  components: {
    AppBar,
  },

  data: () => ({
    //
  }),
};
</script>
