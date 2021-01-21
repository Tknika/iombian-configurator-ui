<template>
  <v-dialog persistent v-model="show" @keydown.esc="close(false)" max-width="500px">
    <v-card>
      <v-card-title>New Device</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="deviceId"
          label="Device ID"
          prepend-icon="mdi-identifier"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close(false)">Cancel</v-btn>
        <v-btn color="primary" @click="close(true)">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NewDeviceDialog",
  props: {
    show: Boolean,
  },
  data: () => ({
    deviceId: "",
  }),
  methods: {
    close(store) {
      if (store) this.$store.dispatch("user/addDevice", this.deviceId);
      this.deviceId = "";
      this.$emit("closed");
    },
  },
};
</script>