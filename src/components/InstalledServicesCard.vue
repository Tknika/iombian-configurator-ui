<template>
  <v-card>
    <v-card-title>
      Installed Services
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <ul style="list-style-type: none;">
            <li v-for="service in services" :key="service.id">
              <InstalledServiceCard :service="service" :installed="true" />
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import InstalledServiceCard from "./InstalledServiceCard.vue";

export default {
  name: "InstalledServicesCard",
  components: {
    InstalledServiceCard
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
