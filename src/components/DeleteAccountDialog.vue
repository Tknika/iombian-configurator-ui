<template>
  <v-dialog persistent v-model="show" @keydown.esc="close(false)" max-width="500px">
    <v-card>
      <v-card-title>Delete Account</v-card-title>
      <v-card-text>Are you sure you want to delete your account? This will delete all your data and cannot be undone.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text autofocus @click="close(false)">Cancel</v-btn>
        <v-btn color="red" dark @click="close(true)">Delete Account</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "DeleteAccountDialog",
  props: {
    show: Boolean,
  },
  methods: {
    async close(deleteAccount) {
      if (deleteAccount) {
        try {
          // Delete user data from Firestore
          await this.$store.dispatch("user/deleteUserData");
          
          // Delete Firebase auth account
          await firebase.auth().currentUser.delete();
          
          // Clear user data from store
          this.$store.dispatch("user/clearUserData");
          
          // Redirect to sign-in page
          this.$router.replace({ name: "SignIn" });
        } catch (error) {
          console.error("Error deleting account:", error);
          // If there's an error, still emit closed event
        }
      }
      this.$emit("closed");
    },
  },
};
</script>
