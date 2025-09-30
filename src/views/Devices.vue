<template>
  <v-container>
    <v-card>
      <v-card-title
        >Devices
        <v-spacer></v-spacer>
        <v-btn @click="showNewDeviceDialog = true">Add Device</v-btn>
        <NewDeviceDialog
          :show="showNewDeviceDialog"
          @closed="showNewDeviceDialog = false"
        />
      </v-card-title>
    </v-card>
    <v-container class="px-0">
      <v-scroll-y-transition group>
        <DeviceCard
          :data="device"
          v-for="(device, index) in devices"
          :key="index"
        />
      </v-scroll-y-transition>
    </v-container>
    <v-card class="mt-4">
      <v-card-title>Account Settings</v-card-title>
      <v-card-text>
        <v-btn color="red" dark @click="showDeleteAccountDialog = true">
          Delete Account
          <v-icon right>mdi-account-remove</v-icon>
        </v-btn>
        <DeleteAccountDialog
          :show="showDeleteAccountDialog"
          @closed="showDeleteAccountDialog = false"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import DeviceCard from "../components/DeviceCard.vue";
import NewDeviceDialog from "../components/NewDeviceDialog.vue";
import DeleteAccountDialog from "../components/DeleteAccountDialog.vue";
export default {
  name: "Devices",
  components: {
    DeviceCard,
    NewDeviceDialog,
    DeleteAccountDialog,
  },
  data: () => ({
    showNewDeviceDialog: false,
    showDeleteAccountDialog: false,
  }),
  created() {
    this.$store.dispatch("user/bindDevicesRef");
  },
  computed: {
    devices() {
      return this.$store.state.user.devices;
    },
  },
};
</script>
