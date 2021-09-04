<template>
  <div class="hello">
    <button @click="fetchList()">Testando axios</button>
  </div>
</template>

<script>
import {FUNCTIONS} from "../firebase/app";
import json from '../constants/participants.json'
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data(){
    return{
      participants: json
    }
  },
  methods: {
    fetchList() {
      const updatePage = FUNCTIONS.httpsCallable('updateParticipants');
      updatePage(
        // "https://api.itau/open-banking/products-services/v1/personal-accounts"
        {data: this.participants}
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
