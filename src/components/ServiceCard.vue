<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <div class="text-subtitle-1">
            {{ labels[id]["name"] }}
          </div>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="primary">Install</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ServiceCard",
  props: {
    id: {
      type: String
    },
    version: {
      type: String
    },
  },
  created() {
    this.loadServiceInfo();
  },
  computed: {
    labels() {
      return this.$store.state.marketplaceServices.services[this.id].labels
    }
  },
  methods: {
    loadServiceInfo() {
      this.$store.dispatch("marketplaceServices/bindServicesRef", { deviceId: this.id, version: this.version }).then(_ => {
        console.log(this.$store.state.marketplaceServices.services[this.id]);
      });
    },
  }
}
</script>
