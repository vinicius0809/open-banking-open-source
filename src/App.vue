<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/comparison">Comparar Crédito</router-link>
    </div>
    <div id="main">
      <router-view />
      <img
        v-if="loading"
        src="@/assets/loading.svg"
        alt="Carregando..."
        width="200px"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {isInvalidOrEmpty} from "./methods/utils";
import {getParticipants} from "./methods/participants";
export default {
  computed: mapState(["loading","participants"]),
  async created() {
    if (isInvalidOrEmpty(this.participants)) {
      await getParticipants();
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-columns: 0.05fr 1fr 0.05fr;
}

#nav {
  padding: 30px;
  grid-column: 2;
  grid-row: 1;
  align-self: center;
  justify-self: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#main {
  grid-column: 2;
  grid-row: 2;
  align-self: center;
  justify-self: center;
}
</style>
