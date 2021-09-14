<template>
  <div class="participant">
    <h1>{{ participant.RegisteredName }}</h1>
    <div class="title"><strong>Id: </strong>{{ participantId }}</div>
    <hr />
    <strong> Authorization Servers:</strong>
    <div class="authorization-servers">
      <AuthorizationServer
        v-for="authorizationServer in participant.AuthorisationServers"
        :key="authorizationServer.AuthorisationServerId"
        :authorizationServer="authorizationServer"
        @click.native="authorizationServerDetails(authorizationServer)"
      />
    </div>
  </div>
</template>

<script>
import AuthorizationServer from "@/components/AuthorizationServer.vue";
import { mapState } from "vuex";
import { getParticipants } from "@/methods/participants.js";

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
          propAuthorizationServer: authorizationServer,
        },
      });
    },
  },
  async created() {
    if (
      this.participants == null ||
      this.participants == "undefined" ||
      this.participants.length == 0
    ) {
      await getParticipants();
    }

    if (this.participant == null || this.participant == "undefined") {
      this.participants.forEach((element) => {
        if (element.RegistrationId == this.participantId) {
          this.participant = element;
        }
      });
    }
  },
  computed: mapState(["participants"]),
  data() {
    return {
      participant: null,
    };
  },
};
</script>

<style>
.logo {
  width: 250px;
  height: 250px;
}

.title {
  text-align: center;
}
.authorization-servers {
  display: flex;
  flex-wrap: wrap;
}
</style>