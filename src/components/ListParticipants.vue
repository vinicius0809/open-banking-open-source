<template>
  <div class="home">
    <div class="filter">
      <label for="filter">Filtrar por nome: </label>
      <input id="filter" v-model="filter" type="text" :disabled="loading" />
    </div>
    <div class="participants">
      <Participant
        v-for="participant in participantsFiltered"
        :key="participant.OrganisationId"
        :authorizationServers="participant.AuthorisationServers"
        :companyName="participant.RegisteredName"
        @click.native="participantDetails(participant)"
      />
    </div>
  </div>
</template>

<script>
import Participant from "@/components/Participant.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "ListParticipants",
  components: {
    Participant,
  },
  data() {
    return {
      filter: "",
    };
  },
  computed: {
    ...mapState(["participants", "loading"]),
    participantsFiltered() {
      let result = this.participants;
      if (this.filter !== "") {
        result = result.filter((i) => {
          return (
            i.RegisteredName.toLowerCase()
              .normalize("NFD")
              .indexOf(this.filter.toLowerCase().normalize("NFD")) > -1
          );
        });
      }
      return result;
    },
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
.filter {
  flex-wrap: wrap;
}
</style>
