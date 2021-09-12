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
import { FUNCTIONS } from "../firebase/app";
import Participant from "@/components/Participant.vue";
import json from "../constants/participants.json";
import { mapActions } from "vuex";
export default {
  name: "ListParticipants",
  components: {
    Participant,
  },
  data() {
    return {
      json,
      participants: [],
    };
  },
  created() {
    this.getParticipants();
  },
  methods: {
    orderedByNameParticipants(participants) {
      return participants.sort(function(a, b) {
        return a.RegisteredName.localeCompare(b.RegisteredName)
      });
    },
    ...mapActions(["startLoading", "stopLoading"]),
    participantDetails(participant) {
      this.$router.push({
        name: "Participant",
        params: {
          propParticipantId: participant.RegistrationId,
          propParticipant: participant,
        },
      });
    },
    async getParticipants() {
      this.startLoading();
      const url =
        "https://data.directory.openbankingbrasil.org.br/participants";
      const getUrlData = FUNCTIONS.httpsCallable("getUrlData");
      await getUrlData({ url })
        .then((result) => {
          this.participants = this.orderedByNameParticipants(result.data);
        })
        .finally(() => this.stopLoading());
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
