<template>
  <div class="participant">
    <div class="title">
      <strong>{{ companyName }}</strong>
    </div>
    <hr />
    <div class="authorization-servers-count">
      Authorization Servers: {{ authorizationServers.length}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    companyName: String,
    authorizationServers: Array,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.participant{
  width: 250px;
  border: 1px solid black;
  padding: 5px;
  margin: 10px;
  flex-grow: 1;
  align-self: center;
}
.participant:hover{
    cursor: pointer;
    background-color: darkgray;
}

.title{
  text-align: center;
}
.authorization-servers-count{
   text-align: center;
}
</style>