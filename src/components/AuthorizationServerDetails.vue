<template>
  <div class="authorization-server">
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
          <DataDetails
            v-if="shouldShowThisData(discoveryEndpoint.ApiEndpoint)"
            :urlData="selectedApiData"
          />
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
import { getParticipants } from "@/methods/participants.js";
export default {
  props: {
    participantId: String,
    authorizationServerId: String,
  },
  components: {
    DataDetails,
  },
  computed: {
    ...mapState(["loading","participants"]),
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
    ...mapActions(["startLoading", "stopLoading"]),
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
      participant: null,
      authorizationServer: null,
    };
  },
  async created() {
    if (
      this.participants == null ||
      this.participants == "undefined" ||
      this.participants.length == 0
    ) {
      await getParticipants();
    }

    if (this.participant == null || this.participant == "undefined") {
      this.participants.forEach((element) => {
        if (element.RegistrationId == this.participantId) {
          this.participant = element;
        }
      });
    }

    if (
      this.authorizationServer == null ||
      this.authorizationServer == "undefined"
    ) {
      this.participant.AuthorisationServers.forEach((element) => {
        if (element.AuthorisationServerId == this.authorizationServerId) {
          this.authorizationServer = element;
        }
      });
    }
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
  flex-grow: 1;
  align-content: center;
  align-self: center;
}
.title {
  flex-grow: 1;
  align-content: center;
  align-self: center;
}
</style>