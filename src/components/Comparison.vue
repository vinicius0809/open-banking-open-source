<template>
  <div class="main">
    Dentro do componente
    <div class="filter-credit-type">
      <label for="filter-credit-type">Filtrar por tipo de crédito: </label>
      <select
        id="filter-credit-type"
        v-model="filterCreditType"
        name="filter-credit-type"
      >
        <option value="loan">Empréstimo</option>
        <option value="financing" selected>Financiamento</option>
        <option value="invoice-financing">Antecipação de Recebíveis</option>
        <option value="credit-card">Cartão de Crédito</option>
      </select>
    </div>
    <div class="credit-type" v-if="filterCreditType">
      <label for="credit-type">Selecione as empresas: </label>
      <button
        type="checkbox"
        v-for="type in participantsWithThisCreditType"
        :key="type.RegistrationId"
      >
        {{ type.RegisteredName }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getParticipants } from "../methods/participants";

export default {
  name: "Comparison",
  data() {
    return {
      filterCreditType: "",
      participantAuthorizationServers: [],
      filteredParticipants: [],
    };
  },
  computed: {
    ...mapState(["participants"]),
    participantsWithThisCreditType() {
      let filteredParticipants = [];
      this.participants.forEach((participant) => {
        participant.AuthorisationServers.forEach((authorizationServer) => {
          authorizationServer.ApiResources.forEach((apiResource) => {
            if (apiResource.ApiFamilyType === "products-services") {
              apiResource.ApiDiscoveryEndpoints.forEach((endpoint) => {
                if (
                  this.filterCreditType &&
                  endpoint.ApiEndpoint.indexOf(this.filterCreditType) > -1 &&
                  !filteredParticipants.includes(participant)
                ) {
                  filteredParticipants.push(participant);
                }
              });
            }
          });
        });
      });
      return filteredParticipants;
    },
  },
  created() {
    if (
      this.participants == null ||
      this.participants === "undefined" ||
      this.participants.length === 0
    ) {
      getParticipants();
    }
  },
};
</script>

<style scoped></style>
