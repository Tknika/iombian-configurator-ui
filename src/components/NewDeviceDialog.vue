<template>
  <v-dialog persistent v-model="show" @keydown.esc="close(false)" max-width="500px">
    <v-card>
      <v-card-title>New Device</v-card-title>
      <v-card-text>
        <v-form ref="deviceIdform" v-model="isDeviceIdValid">
          <v-text-field
            v-model="deviceId"
            label="Device ID"
            hint="Device ID will also be used as the hostname"
            persistent-hint
            prepend-icon="mdi-identifier"
            :rules="[rules.required, rules.hostname]"
        ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close(false)">Cancel</v-btn>
        <v-btn :disabled="!isDeviceIdValid" color="primary" @click="close(true)">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NewDeviceDialog",
  props: {
    show: Boolean
  },
  data: () => ({
    deviceId: "",
    isDeviceIdValid: false,
    rules: {
      required: value => !!value || 'Required',
      hostname: value => {
        const pattern = /^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$/g;
        return pattern.test(value) || 'Only letters from a to z, digits from 0 to 9 and the hyphen (-) are allowed (63)'
      }
    }
  }),
  methods: {
    close(store) {
      if (store) this.$store.dispatch("user/addDevice", this.deviceId);
      this.$refs.deviceIdform.reset();
      this.$emit("closed");
    },
  },
};
</script>