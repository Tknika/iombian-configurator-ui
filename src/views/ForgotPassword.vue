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
      <v-card-title class="justify-center">
        <h3>Reset Password</h3>
      </v-card-title>
      <v-form v-model="validEmail" class="pa-4">
        <v-text-field
          v-model="email"
          filled
          append-icon="mdi-email-outline"
          label="Email"
          type="email"
          :rules="emailRules"
          hint="Enter your email address to receive password reset instructions"
          persistent-hint
        ></v-text-field>
      </v-form>
      <v-alert v-if="errorMsg" border="top" color="red" class="ml-5 mr-5">{{
        errorMsg
      }}</v-alert>
      <v-alert v-if="successMsg" border="top" color="green" class="ml-5 mr-5">{{
        successMsg
      }}</v-alert>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn depressed @click="signIn">Back to Sign In</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!validEmail"
          color="primary"
          :loading="isLoading"
          @click="sendPasswordReset"
          ><v-icon left v-if="!$vuetify.breakpoint.xs">mdi-email-send</v-icon>Send Reset Email</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "ForgotPassword",
  data: () => ({
    email: "",
    errorMsg: "",
    successMsg: "",
    validEmail: false,
    isLoading: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ]
  }),
  methods: {
    async sendPasswordReset() {
      this.isLoading = true;
      this.errorMsg = "";
      this.successMsg = "";
      
      try {
        await firebase.auth().sendPasswordResetEmail(this.email.toLowerCase());
        this.successMsg = "Password reset email sent! Please check your inbox and follow the instructions to reset your password.";
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            this.errorMsg = "No account found with this email address.";
            break;
          case "auth/invalid-email":
            this.errorMsg = "Invalid email address.";
            break;
          case "auth/too-many-requests":
            this.errorMsg = "Too many requests. Please try again later.";
            break;
          default:
            this.errorMsg = "An unexpected error occurred. Please try again.";
            console.log(error);
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