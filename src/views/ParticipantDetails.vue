<template>
  <div class="home">
    <h1>{{ participant.RegisteredName }}</h1>
    <ParticipantDetails
      :participantId="this.$route.params.propParticipantId"
      :participant="participant"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import ParticipantDetails from "@/components/ParticipantDetails.vue";

export default {
  name: "ParticipantDetailsView",
  components: {
    ParticipantDetails,
  },
  data() {
    return {
      participant: this.$route.params.propParticipant,
    };
  },
};
</script>
