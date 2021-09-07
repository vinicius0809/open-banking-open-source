<template>
  <div class="authorization-server">
    <div class="title"><strong>Id: </strong>{{ authorizationServerId }}</div>
    <hr />
    <strong> API Resources:</strong>
    {{ authorizationServer.ApiResources.length }}
    <div class="api-resources">
      <button
        v-for="apiResource in authorizationServer.ApiResources"
        :key="apiResource.ApiResourceId"
        :class="getApiResourceClasses(apiResource.ApiResourceId)"
        @click="showDetails(apiResource)"
      >
        {{ apiResource.ApiFamilyType }}
        - v{{ apiResource.ApiVersion }}
      </button>
    </div>
    <hr />
    <div class="api-resources-details" v-if="showingDetails">
      <div
        v-for="discoveryEndpoint in selectedApiResource.ApiDiscoveryEndpoints"
        :key="discoveryEndpoint.ApiDiscoveryId"
      >
        <p v-if="!isPublicEndpoint(discoveryEndpoint.ApiEndpoint)">
          {{ discoveryEndpoint.ApiEndpoint }}
        </p>
        <p v-else>
          <button>{{ discoveryEndpoint.ApiEndpoint }}</button>
        </p>
      </div>
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
      this.selectedApiResource = apiResource;
    },
    isPublicEndpoint(endpoint) {
      return (
        endpoint.indexOf("products-services") > -1 ||
        endpoint.indexOf("channels") > -1
      );
    },
    getApiResourceClasses(resourceId) {
      const selectedClass =
        resourceId == this.selectedApiResource.ApiResourceId ? " selected" : "";
      return "api-resource-item" + selectedClass;
    },
  },
  data() {
    return {
      isShowingDetails: false,
      selectedApiResource: {},
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
.selected,
.api-resource-item:hover {
  cursor: pointer;
  background-color: darkgray;
}
</style>