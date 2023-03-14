<template>
  <div>
    <v-img src="/logo.svg" alt="IoMBian Configurator Logo" contain height="200"></v-img>
    <v-card class="mx-auto" style="max-width: 500px">
      <v-overlay :value="isLoading">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <v-form ref="form" v-model="validCredentials" class="pa-4 mt-6">
        <v-text-field
          v-model="name"
          filled
          append-icon="mdi-account-outline"
          label="Name"
        ></v-text-field>
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
          :rules="passwordRules"
        ></v-text-field>
      </v-form>
      <v-alert v-if="errorMsg" border="top" color="red" class="ml-5 mr-5">{{
        errorMsg
      }}</v-alert>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn depressed @click="signIn">Sign In</v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="$refs.form.reset()">Clear</v-btn>
        <v-btn
          :disabled="!validCredentials"
          color="primary"
          :loading="isLoading"
          depressed
          @click="signUpWithEmailAndPassword"
          >Sign Up</v-btn
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
    name: "",
    email: "",
    password: "",
    errorMsg: "",
    validCredentials: false,
    isLoading: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must have 6+ characters'
    ]
  }),
  methods: {
    async signUpWithEmailAndPassword() {
      this.isLoading = true;
      try {
        let authRes = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.email.toLowerCase(),
            this.password
          );

        await db.collection("users").doc(authRes.user.uid).set({
          name: this.name,
          email: this.email,
          refreshToken: authRes.user.refreshToken,
        });

        this.$store.dispatch("user/setUserData", {
          id: authRes.user.uid,
          name: this.name,
          email: this.email,
          refreshToken: authRes.user.refreshToken,
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
    signIn() {
      this.$router.replace({ name: "SignIn" });
    },
  },
};
</script>