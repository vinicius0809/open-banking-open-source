<template>
  <div class="authorization-server">
    <img
      :src="authorizationServer.CustomerFriendlyLogoUri"
      alt="logo"
      class="logo"
    />
    <div>
      <strong>{{ authorizationServer.CustomerFriendlyName }}</strong>
    </div>
    <div>
      {{ authorizationServer.CustomerFriendlyDescription }}
    </div>
    <div class="developer-portal">
      <a
        v-if="
          authorizationServer.DeveloperPortalUri &&
          authorizationServer.DeveloperPortalUri.indexOf('naoseaplica') == -1
        "
        :href="authorizationServer.DeveloperPortalUri"
        target="_blank"
        ><strong>Portal do Desenvolvedor </strong></a
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    authorizationServer: Object,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.authorization-server {
  width: 250px;
  border: 1px solid black;
  padding: 5px;
  margin: 10px;
  flex-grow: 1;
  align-self: center;
}
.authorization-server:hover {
  cursor: pointer;
  background-color: darkgray;
}
</style>