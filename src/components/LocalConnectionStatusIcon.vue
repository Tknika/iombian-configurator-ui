<template>
  <v-tooltip bottom v-if="localConnectionStatus == 'online'">
    <template v-slot:activator="{ on, attrs }">
      <v-icon :color="connectionStatusColor" right v-bind="attrs" v-on="on">{{
        connectionStatusIcon
      }}</v-icon>
    </template>
    <span>{{ connectionStatusMessage }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "LocalConnectionStatusIcon",
  props: {
    localConnectionStatus: {
      type: String,
      default: "unknown",
      required: true,
    },
  },
  data: () => ({
    statusMap: {
      online: {
        icon: "mdi-lan-connect",
        color: "green",
        message: "Local connection available",
      },
      loading: {
        icon: "mdi-lan-pending",
        color: "orange",
        message: "Checking local connection availability",
      },
      offline: {
        icon: "mdi-lan-disconnect",
        color: "red",
        message: "Local connection not available",
      },
      unknown: {
        icon: "mdi-lan-pending",
        color: "grey",
        message: "Local connection availability not known",
      },
    },
  }),
  computed: {
    connectionStatusIcon() {
      const icon = this.statusMap[this.localConnectionStatus].icon;
      return icon;
    },
    connectionStatusColor() {
      return this.statusMap[this.localConnectionStatus].color;
    },
    connectionStatusMessage() {
      return this.statusMap[this.localConnectionStatus].message;
    },
  },
  created() {},
  destroyed() {},
  methods: {},
};
</script>