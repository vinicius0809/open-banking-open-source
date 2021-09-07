<template>
  <div class="participant">
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
export default {
  props: {
    participantId: String,
    participant: Object,
  },
  components: {
    AuthorizationServer,
  },
  methods:{
authorizationServerDetails(authorizationServer){
      this.$router.push({
        name:"AuthorizationServer",
        params:{
          propParticipantId: this.participantId,
          propAuthorizationServerId: authorizationServer.AuthorisationServerId,
          propAuthorizationServer: authorizationServer
        }
      })
    }
  },
  data() {
    return {
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