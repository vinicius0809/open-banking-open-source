<template>
  <div class="participant">
    <template v-if="participantsLoaded">
      <h1>{{ participant.RegisteredName }}</h1>
      <div class="title"><strong>Id: </strong>{{ participantId }}</div>
      <hr />
      <strong> Empresas:</strong>
      <div class="authorization-servers">
        <AuthorizationServer
          v-for="authorizationServer in participant.AuthorisationServers"
          :key="authorizationServer.AuthorisationServerId"
          :authorizationServer="authorizationServer"
          @click.native="authorizationServerDetails(authorizationServer)"
        /></div
    ></template>
  </div>
</template>

<script>
import AuthorizationServer from "@/components/AuthorizationServer.vue";
import { mapState } from "vuex";

export default {
  props: {
    participantId: String,
  },
  components: {
    AuthorizationServer,
  },
  methods: {
    authorizationServerDetails(authorizationServer) {
      this.$router.push({
        name: "AuthorizationServer",
        params: {
          propParticipantId: this.participantId,
          propAuthorizationServerId: authorizationServer.AuthorisationServerId,
        },
      });
    },
  },
  computed: {
    ...mapState(["participants", "participantsLoaded"]),
    participant() {
      let result = undefined;
      if (this.participantsLoaded) {
        result = this.participants.find(
          (el) => el.RegistrationId === this.participantId
        );
      }
      return result;
    },
  },
};
</script>

<style>
.title {
  text-align: center;
}
.authorization-servers {
  display: flex;
  flex-wrap: wrap;
}
</style>
