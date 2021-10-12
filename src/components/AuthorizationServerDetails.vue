<template>
  <div class="authorization-server">
    <template v-if="participantsLoaded">
      <div class="company-present">
        <img
          :src="authorizationServer.CustomerFriendlyLogoUri"
          alt="logo"
          class="logo"
        />
        <h1 class="title">{{ authorizationServer.CustomerFriendlyName }}</h1>
      </div>
      <p>{{ authorizationServer.CustomerFriendlyDescription }}</p>
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
          <div>
            {{ discoveryEndpoint.ApiEndpoint }}
          </div>
        </div>
      </div></template
    >
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    participantId: String,
    authorizationServerId: String,
  },
  computed: {
    ...mapState(["loading", "participants", "participantsLoaded"]),
    showingDetails() {
      return this.isShowingDetails;
    },
    authorizationServer() {
      let result = undefined;
      if (this.participantsLoaded) {
        result = this.participant.AuthorisationServers.find(
          (as) => as.AuthorisationServerId === this.authorizationServerId
        );
      }
      return result;
    },
    participant() {
      let result = undefined;
      if (this.participantsLoaded) {
        result = this.participants.find(
          (el) => el.RegistrationId === this.participantId
        );
      }
      return result;
    },
  },
  methods: {
    ...mapActions(["startLoading", "stopLoading"]),
    showDetails(apiResource) {
      this.isShowingDetails = true;
      this.selectedApiResource = apiResource;
    },
    getApiResourceClasses(resourceId) {
      const selectedClass =
        resourceId === this.selectedApiResource.ApiResourceId
          ? " selected"
          : "";
      return "api-resource-item" + selectedClass;
    }
  },
  data() {
    return {
      isShowingDetails: false,
      selectedApiResource: {},
      selectedApiData: {},
      selectedApiDataUrl: "",
    };
  }
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
.company-present {
  display: flex;
  flex-wrap: wrap;
}
.logo {
  align-content: center;
  align-self: center;
  flex-grow:1;
}
.title {
  flex-grow: 1;
  align-content: center;
  align-self: center;
}
.logo {
  width: 500px;
  height: 500px;
}
</style>
