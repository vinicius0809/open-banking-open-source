<template>
  <div class="hello">
    <li v-for="participant in participants" :key="participant.RegistrationId">
      {{ participant.RegisteredName }}
    </li>
  </div>
</template>

<script>
import { FUNCTIONS } from "../firebase/app";
import json from "../constants/participants.json";
export default {
  name: "ListParticipants",
  data() {
    return {
      json: json,
      participants: [],
    };
  },
  created() {
    this.getParticipants();
  },
  methods: {
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
        // "https://api.itau/open-banking/products-services/v1/personal-accounts"
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
</style>
