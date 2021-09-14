<template>
  <div class="participants">
    <Participant
      v-for="participant in participants"
      :key="participant.RegistrationId"
      :companyName="participant.RegisteredName"
      :authorizationServers="participant.AuthorisationServers"
      @click.native="participantDetails(participant)"
    />
  </div>
</template>

<script>
import Participant from "@/components/Participant.vue";
import json from "../constants/participants.json";
import { mapActions, mapState } from "vuex";
import { getParticipants } from "@/methods/participants.js";
export default {
  name: "ListParticipants",
  components: {
    Participant,
  },
  data() {
    return {
      json,
    };
  },
  computed: mapState(["participants"]),
  created() {
    if (
      this.participants == null ||
      this.participants == "undefined" ||
      this.participants.length == 0
    ) {
      getParticipants();
    }
  },
  methods: {
    ...mapActions(["startLoading", "stopLoading", "setParticipants"]),
    participantDetails(participant) {
      this.$router.push({
        name: "Participant",
        params: {
          propParticipantId: participant.RegistrationId,
          propParticipant: participant,
        },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.participants {
  display: flex;
  flex-wrap: wrap;
}
</style>
