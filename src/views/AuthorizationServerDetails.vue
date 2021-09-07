<template>
  <div class="home">
    <div class="company-present">
      <img
        :src="authorizationServer.CustomerFriendlyLogoUri"
        alt="logo"
        class="logo"
      />
      <h1 class="title">{{ authorizationServer.CustomerFriendlyName }}</h1>
    </div>
    <p>{{ authorizationServer.CustomerFriendlyDescription }}</p>
    <AuthorizationServerDetails
      :participantId="this.$route.params.propParticipantId"
      :authorizationServerId="this.$route.params.propAuthorizationServerId"
      :authorizationServer="authorizationServer"
    />
  </div>
</template>

<script>
import AuthorizationServerDetails from "@/components/AuthorizationServerDetails.vue";

export default {
  name: "AuthorizationServerDetailsView",
  components: {
    AuthorizationServerDetails,
  },
  data() {
    return {
      authorizationServer: this.$route.params.propAuthorizationServer,
    };
  },
};
</script>
<style scoped>
.company-present {
  display:flex;
  flex-wrap: wrap;
}
.logo{
  flex-grow: 1;
  align-content: center;
  align-self: center;
}
.title{
  flex-grow: 1;
  align-content: center;
  align-self: center;
}
</style>