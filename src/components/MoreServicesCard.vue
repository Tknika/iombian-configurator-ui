<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header class="text-h6 px-4">
        Explore More Services
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12">
            <ul style="list-style-type: none;">
              <li v-for="(service, index) in services" :key="index">
                <ServiceCard :service="service" />
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import ServiceCard from "./ServiceCard.vue"

export default {
  name: "MoreServicesCard",
  components: {
    ServiceCard
  },
  props: {
    services: {
      type: []
    }
  },
}
</script>
