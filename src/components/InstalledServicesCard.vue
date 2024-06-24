Component for displaying all the services that are installed in the device.

Requires a list of the services to display.
Services are objects with the properties of the labels of the firestore services:
- id
- name
- version
- author
- description
- documentation_url
- changelog
- ${service-name}
  - envs
    - ...

<template>
  <v-card>
    <v-card-title>
      Installed Services
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <ul style="list-style-type: none; padding-left: 0;">
            <li v-for="service in services" :key="service.id" class="my-6">
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
}
</script>
