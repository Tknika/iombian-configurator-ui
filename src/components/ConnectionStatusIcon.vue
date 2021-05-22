<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon :color="connectionStatusColor" right v-bind="attrs" v-on="on">{{ connectionStatusIcon }}</v-icon>
    </template>
    <span>{{ connectionStatusMessage }}</span>
  </v-tooltip>
</template>

<script>
import strftime from "strftime";

export default {
  name: "ConnectionStatusIcon",
  props: {
    lastConnection: {
        type: Number,
        required: true,
    }
  },
  data: () => ({
    statusMap: {  "online": { "icon": "mdi-check-circle", "color": "green" },
                  "warning": { "icon": "mdi-alert-circle", "color": "orange" },
                  "offline": { "icon": "mdi-alert-circle", "color": "red"},
                  "unknown": { "icon": "mdi-help-circle", "color": "grey"},
                },
    nowTimestamp: Date.now(),
    nowTimestampTimer: null,
    nowTimestampRefreshPeriodMs: 60000,
  }),
  computed: {
    lastConnectionFormated() {
      return strftime("%Y-%m-%d %H:%M:%S", new Date(this.lastConnection*1000));
    },
    lastConnectionElapsedHours() {
      return this.lastConnection < 0 ? -1 : (Math.round(this.nowTimestamp / 1000) - this.lastConnection) / 3600;
    },
    connectionStatus() {
      const elapsedHours = this.lastConnectionElapsedHours;
      return elapsedHours < 0 ? "unknown" : elapsedHours < 1 ? "online" : elapsedHours < 2 ? "warning" : "offline"
    },
    connectionStatusIcon() {
      const status = this.connectionStatus;
      return this.statusMap[status]["icon"];
    },
    connectionStatusColor() {
      const status = this.connectionStatus;
      return this.statusMap[status]["color"]
    },
    connectionStatusMessage() {
      switch (this.connectionStatus) {
        case "online":
          return "Connected device";
        case "warning":
          return "Last connection >1 hour ago";
        case "offline":
          return `Last connection: ${this.lastConnectionFormated}`;
        case "unknown":
          return "Never connected or unsupported device"
        default:
          return "No information";
      }
    },
  },
  created() {
    this.nowTimestampTimer = setInterval(this.refreshNowTimestamp, this.nowTimestampRefreshPeriodMs);
  },
  destroyed() {
    this.cancelNowTimestampTimer();
  },
  methods: {
    refreshNowTimestamp() {
      this.nowTimestamp = Date.now();
    },
    cancelNowTimestampTimer() {
      clearInterval(this.nowTimestampTimer);
    }
  }
}
</script>