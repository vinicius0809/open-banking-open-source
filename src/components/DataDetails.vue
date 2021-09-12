<template>
  <div class="data-details">
    {{ urlData.data.links.self }}
    <BusinessAccounts
      v-if="isBusinessAccount(urlData.data.links.self)"
      :data="urlData.data.data"
    />
    <PersonalAccounts
      v-if="isPersonalAccount(urlData.data.links.self)"
      :data="urlData.data.data"
    />
    <GenericLoans
      v-if="isGenericLoan(urlData.data.links.self)"
      :data="urlData.data.data"
    />
  </div>
</template>

<script>
import BusinessAccounts from "./TypesProductsServices/BusinessAccounts.vue";
import PersonalAccounts from "./TypesProductsServices/PersonalAccounts.vue";
import GenericLoans from "./TypesProductsServices/GenericLoans.vue";
export default {
  props: {
    urlData: Object,
  },
  components: { BusinessAccounts, PersonalAccounts, GenericLoans },
  computed: {
    showingDetails() {
      return this.isShowingDetails;
    },
  },
  methods: {
    isBusinessAccount(url) {
      return url.indexOf("business-accounts") > -1;
    },
    isPersonalAccount(url) {
      return url.indexOf("personal-accounts") > -1;
    },
    isGenericLoan(url) {
      return url.indexOf("financings") > -1 || url.indexOf("loans") > -1;
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