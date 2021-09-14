<template>
  <div class="home">    
    <AuthorizationServerDetails
      :participantId="this.$route.params.propParticipantId"
      :authorizationServerId="this.$route.params.propAuthorizationServerId"
    />
  </div>
</template>

<script>
import AuthorizationServerDetails from "@/components/AuthorizationServerDetails.vue";

export default {
  name: "AuthorizationServerDetailsView",
  components: {
    AuthorizationServerDetails,
  }
};
</script>
<style scoped>

</style>