<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <div class="text-subtitle-1">
            {{ name }}
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
  data() {
    return {
      name: "Name"
    }
  },
  created() {
    this.loadServiceInfo();
  },
  destroyed() {
    this.deleteServiceInfo();
  },
  computed: {
    labels() {
      console.log("Hola")
      return this.$store.state.marketplaceServices.services[this.id].labels
    }
  },
  methods: {
    loadServiceInfo() {
      this.$store.dispatch("marketplaceServices/bindServicesRef", { serviceId: this.id, version: this.version }).then(service => {
        console.log(service.labels[this.id].name);
        this.name = service.labels[this.id].name;
      })
    },
    deleteServiceInfo() {
      this.$store.dispatch("marketplaceServices/unbindServicesRef", this.id);
      this.$store.dispatch("marketplaceServices/removeServiceFromServices", this.id);
    }
  },
  watch: {
    "this.$store.state.marketplaceServices.services": {
      deep: true,
      handler: function (newValue) {
        console.log("Mereketengue")
      }
    }
  }
}
</script>
