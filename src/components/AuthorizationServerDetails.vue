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
        <div v-if="!isPublicEndpoint(discoveryEndpoint.ApiEndpoint)">
          {{ discoveryEndpoint.ApiEndpoint }}
        </div>
        <div v-else>
          <button
            v-if="loadingThisData(discoveryEndpoint.ApiEndpoint)"
            @click="getApiData(discoveryEndpoint.ApiEndpoint)"
          >
            {{ discoveryEndpoint.ApiEndpoint }}
          </button>
          <DataDetails v-if="shouldShowThisData(discoveryEndpoint.ApiEndpoint)" :urlData="selectedApiData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import AuthorizationServer from "@/components/AuthorizationServer.vue";
// import axios from "axios";
import { FUNCTIONS } from "../firebase/app";
import { mapActions, mapState } from "vuex";
import DataDetails from "@/components/DataDetails.vue";
export default {
  props: {
    participantId: String,
    participant: Object,
    authorizationServerId: String,
    authorizationServer: Object,
  },
  components: {
    DataDetails,
  },
  computed: {
    ...mapState(["loading"]),
    showingDetails() {
      return this.isShowingDetails;
    },
  },
  methods: {
    loadingThisData(url) {
      return !this.loading || (this.loading && this.selectedApiDataUrl == url);
    },
    shouldShowThisData(url) {
      return (
        this.selectedApiData != null &&
        this.selectedApiData != "undefined" &&
        this.selectedApiDataUrl == url
      );
    },
    ...mapActions(["startLoading", "stopLoading", "isLoading"]),
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
    getApiData(url) {
      this.startLoading();
      console.log("Chamando url: " + url);
      const getUrlData = FUNCTIONS.httpsCallable("getUrlData");
      let data = { url };
      getUrlData(data)
        .then((response) => {
          this.selectedApiData = response;
          this.selectedApiDataUrl = url;
          console.log(this.selectedApiData);
        })
        .catch((error) => console.log(error.message))
        .finally(() => this.stopLoading());
    },
  },
  data() {
    return {
      isShowingDetails: false,
      selectedApiResource: {},
      selectedApiData: {},
      selectedApiDataUrl: "",
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