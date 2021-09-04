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
export default {
  name: "ListParticipants",
  components: {
    Participant,
  },
  data() {
    return {
      json: json,
      // participants: [],
      participants: json
    };
  },
  created() {
    // this.getParticipants();
  },
  methods: {
    participantDetails(participant){
      this.$router.push({
        name:"Participant",
        params:{
          propParticipantId: participant.RegistrationId,
          propParticipant: participant
        }
      })
    },
    async getParticipants() {
      const getParticipants = FUNCTIONS.httpsCallable("getParticipants");
      await getParticipants().then((result) => {
        console.log(result.data);
        this.participants = result.data;
      });
    },
    fetchList() {
      const updatePage = FUNCTIONS.httpsCallable("updateParticipants");
      updatePage(
        { data: this.json }
      ).then((result) => {
        console.log(result.data);
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
.participants{
  display: flex;
  flex-wrap: wrap;
}
</style>
