<template>
  <div class="authorization-server">
    <div class="title"><strong>Id: </strong>{{ authorizationServerId }}</div>
    <hr />
    <strong> API Resources:</strong>
    {{ authorizationServer.ApiResources.length }}
    <div class="api-resources">
      <ul
        v-for="apiResource in authorizationServer.ApiResources"
        :key="apiResource.ApiResourceId"
        class="api-resource-item"
        @click="showDetails(apiResource)"
      >
        {{
          apiResource.ApiFamilyType
        }}
        - v{{
          apiResource.ApiVersion
        }}
      </ul>
    </div>
    <hr />
    <div class="api-resources-details" v-if="showingDetails()">
      asdasdasdasd
    </div>
  </div>
</template>

<script>
// import AuthorizationServer from "@/components/AuthorizationServer.vue";
export default {
  props: {
    participantId: String,
    participant: Object,
    authorizationServerId: String,
    authorizationServer: Object,
  },
  components: {
    // AuthorizationServer,
  },
  computed: {
    showingDetails() {
      return this.isShowingDetails;
    },
  },
  methods: {
    showDetails(apiResource) {
      this.isShowingDetails = true;
      console.log(apiResource);
    },
  },
  data() {
    return {
      isShowingDetails: false,
    };
  },
};
</script>

<style>
.title {
  text-align: center;
}
.api-resources {
  display: flex;
  flex-wrap: wrap;
}
.api-resource-item {
  flex-grow: 1;
  align-self: center;
  padding: 5px;
  margin: 10px;
}
.api-resource-item:hover {
  cursor: pointer;
  background-color: darkgray;
}
</style>