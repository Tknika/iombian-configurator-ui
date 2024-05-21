<template>
  <v-card>
    <v-card-title>
      Installed Services
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <ul style="list-style-type: none;">
            <li v-for="(service, index) in services" :key="index">
              <ServiceCard :service="service" :installed="true"></ServiceCard>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import ServiceCard from "./ServiceCard.vue"

export default {
  name: "InstalledServicesCard",
  components: {
    ServiceCard
  },
  props: {
    services: {
      type: []
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
