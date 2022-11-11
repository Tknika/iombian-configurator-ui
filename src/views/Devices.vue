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
  </v-container>
</template>

<script>
import DeviceCard from "../components/DeviceCard";
import NewDeviceDialog from "../components/NewDeviceDialog";
export default {
  name: "Devices",
  components: {
    DeviceCard,
    NewDeviceDialog,
  },
  data: () => ({
    showNewDeviceDialog: false,
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
