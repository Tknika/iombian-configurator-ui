<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <div class="text-subtitle-1">
            {{ service?.labels.name ?? "Loading name..." }}
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
  created() { },
  computed: {
    service() {
      return this.$store.state.marketplaceServices.services.find(
        (service) => (service.id == this.version && service.labels.id == this.id)
      )
    }
  },
}
</script>
