<template>
  <v-chip class="ml-2" small outlined :color="statusColor" :ripple="false"
    >{{ statusText }}
    <v-progress-circular
      class="ml-2"
      v-if="tunnelStatus == 'loading'"
      size="15"
      width="2"
      indeterminate
      color="orange"
    ></v-progress-circular>
    <v-icon right small v-if="tunnelStatus != 'loading'">{{
      statusIcon
    }}</v-icon></v-chip
  >
</template>

<script>
export default {
  name: "TunnelStatusIcon",
  props: {
    tunnelStatus: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    statusMap: {
      online: { text: "Online", color: "success", icon: "mdi-check" },
      offline: { text: "Offline", color: "error", icon: "mdi-close" },
      loading: { text: "Loading", color: "orange", icon: "mdi-refresh" },
    },
  }),
  computed: {
    statusText() {
      return this.statusMap[this.tunnelStatus]["text"];
    },
    statusColor() {
      return this.statusMap[this.tunnelStatus]["color"];
    },
    statusIcon() {
      return this.statusMap[this.tunnelStatus]["icon"];
    },
  },
};
</script>