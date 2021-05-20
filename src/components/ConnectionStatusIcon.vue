<template>
  <v-icon :color="connectionStatusColor" right>{{ connectionStatusIcon }}</v-icon>
</template>

<script>
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
                  "unknown": { "icon": "help-circle", "color": "blue"},
                },
    nowTimestamp: Date.now(),
    nowTimestampTimer: null,
    nowTimestampRefreshPeriodMs: 60000,
  }),
  computed: {
    lastConnectionElapsedHours() {
      return (Math.round(this.nowTimestamp / 1000) - this.lastConnection) / 3600;
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