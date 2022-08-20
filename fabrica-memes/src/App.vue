<template>
  <v-app>
    <v-app-bar color="indigo" dark fixed app>
      <v-tollbar-title>Fabrica de Memes </v-tollbar-title>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-layout>
           <router-view/>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
