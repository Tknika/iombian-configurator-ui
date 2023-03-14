<template>
  <div>
    <v-img src="/src/assets/logo.svg" alt="IoMBian Configurator Logo" contain height="200"></v-img>
    <v-card class="mx-auto" style="max-width: 500px">
      <v-overlay :value="isLoading">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <v-form v-model="validCredentials" class="pa-4">
        <v-text-field
          v-model="email"
          filled
          append-icon="mdi-email-outline"
          label="Email"
          type="email"
          :rules="emailRules"
        ></v-text-field>
        <v-text-field
          v-model="password"
          filled
          append-icon="mdi-lock-outline"
          label="Password"
          type="password"
          style="min-height: 96px"
          :rules="[v => !!v || 'Password is required']"
        ></v-text-field>
      </v-form>
      <v-alert v-if="errorMsg" border="top" color="red" class="ml-5 mr-5">{{
        errorMsg
      }}</v-alert>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn depressed @click="signUp">Sign Up</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="signInAnonymously"><v-icon :left=!$vuetify.breakpoint.xs>mdi-incognito</v-icon>{{ $vuetify.breakpoint.xs ? '' : 'Anonymous'}}</v-btn>
        <v-btn @click="signInWithGoogle"><v-icon :left=!$vuetify.breakpoint.xs>mdi-google</v-icon>{{ $vuetify.breakpoint.xs ? '' : 'Google'}}</v-btn>
        <v-btn
          :disabled="!validCredentials"
          color="primary"
          @click="signInWithEmailAndPassword"
          ><v-icon left v-if=!$vuetify.breakpoint.xs>mdi-login</v-icon>Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { db } from "../main";
export default {
  data: () => ({
    email: "",
    password: "",
    errorMsg: "",
    validCredentials: false,
    isLoading: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ]
  }),
  methods: {
    async signInWithEmailAndPassword() {
      this.isLoading = true;
      try {
        const authRes = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email.toLowerCase(), this.password);

        const dbUser = await db.collection("users").doc(authRes.user.uid).get();

        const userData = dbUser.data();
        this.$store.dispatch("user/setUserData", {
          id: dbUser.id,
          name: userData.name,
          email: userData.email,
          refreshToken: userData.refreshToken,
        });

        this.$router.replace({ name: "Devices" });
      } catch (error) {
        this.errorMsg = "An unexpected error has ocurred";
        if (error.message) {
          this.errorMsg = error.message;
        }
      }
      this.isLoading = false;
    },
    signUp() {
      this.$router.replace({ name: "SignUp" });
    },
    async signInWithGoogle() {
      this.isLoading = true;
      let provider = new firebase.auth.GoogleAuthProvider();
      try {
        const authRes = await firebase.auth().signInWithPopup(provider);

        const dbUser = await db.collection("users").doc(authRes.user.uid).get();

        if (dbUser.data() === undefined) {
          await db.collection("users").doc(authRes.user.uid).set({
            name: authRes.user.displayName ? authRes.user.displayName : "",
            email: authRes.user.email,
            refreshToken: authRes.user.refreshToken,
          });
        }

        this.$store.dispatch("user/setUserData", {
          id: authRes.user.uid,
          name: authRes.user.displayName ? authRes.user.displayName : "",
          email: authRes.user.email,
          refreshToken: authRes.user.refreshToken,
        });

        this.$router.replace({ name: "Devices" });
      } catch (error) {
        switch (error.code) {
          case "auth/cancelled-popup-request":
            break;
          case "auth/popup-closed-by-user":
            break;
          default:
            this.errorMsg = "An unexpected error has ocurred";
            console.log(error);
        }
      }
      this.isLoading = false;
    },
    async signInAnonymously() {
      this.isLoading = true;

      try {
        const authRes = await firebase.auth().signInAnonymously();

        this.$store.dispatch("user/setUserData", {
          id: authRes.user.uid,
          name: "",
          email: "",
          refreshToken: "",
        });
        this.$router.replace({ name: "Devices" });
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
    },
  },
};
</script>