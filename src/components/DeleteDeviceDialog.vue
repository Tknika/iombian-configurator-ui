<template>
  <v-dialog persistent v-model="show" @keydown.esc="close(false)" max-width="500px">
    <v-card>
      <v-card-title>Delete Device</v-card-title>
      <v-card-text>Are you sure you want to delete '{{deviceId}}'? This can not be undone.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text autofocus @click="close(false)">Cancel</v-btn>
        <v-btn color="red" dark @click="close(true)">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NewDeviceDialog",
  props: {
    show: Boolean,
    deviceId: String,
  },
  methods: {
    close(del) {
      if (del) this.$store.dispatch("user/deleteDevice", this.deviceId);
      this.$emit("closed");
    },
  },
};
</script>