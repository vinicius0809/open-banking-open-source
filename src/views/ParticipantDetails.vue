<template>
  <div class="home">
    <ParticipantDetails
      :participantId="this.$route.params.propParticipantId"
    />
  </div>
</template>

<script>
import ParticipantDetails from "@/components/ParticipantDetails.vue";

export default {
  name: "ParticipantDetailsView",
  components: {
    ParticipantDetails,
  }
};
</script>
