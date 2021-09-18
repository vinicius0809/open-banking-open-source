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
        :class="getParticipantClass(participant)"
        v-for="participant in participantsWithThisCreditType"
        :key="participant.RegistrationId"
        @click="toggleParticipantToComparison(participant)"
      >
        {{ participant.RegisteredName }}
      </button>
    </div>
    <div class="comparison-data" v-if="comparisonParticipants.length > 0">
      <table
        v-for="interestRate in interestRatesFromAllComparisonCompanies"
        :key="interestRate.type"
      >
        <tr>
          <th>{{ interestRate.type }}</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getParticipants } from "../methods/participants";
import { getUrlData } from "../methods/firebaseFunctions";

export default {
  name: "Comparison",
  data() {
    return {
      filterCreditType: "",
      participantUrls: [],
      filteredParticipants: [],
      comparisonParticipants: [],
      dataObject: null,
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
                  this.checkUrlAndFilteredType(
                    endpoint.ApiEndpoint,
                    this.filterCreditType
                  )
                ) {
                  let position = this.participantUrls.findIndex(
                    (x) => x.participantName === participant.RegisteredName
                  );
                  if (position === -1) {
                    this.participantUrls.push({
                      participantName: participant.RegisteredName,
                      participantUrls: [],
                    });
                  }
                  position = this.participantUrls.findIndex(
                    (x) => x.participantName === participant.RegisteredName
                  );
                  this.participantUrls[position].participantUrls.push(
                    endpoint.ApiEndpoint
                  );

                  if (filteredParticipants.indexOf(participant) === -1) {
                    filteredParticipants.push(participant);
                  }
                }
              });
            }
          });
        });
      });
      return filteredParticipants;
    },
    interestRatesFromAllComparisonCompanies() {
      let interestRates = [];
      this.comparisonParticipants.forEach((participant) => {
        let participantData = [];
        participant.participantUrls.forEach((url) => {
          if (this.checkUrlAndFilteredType(url, this.filterCreditType)) {
            this.getData(url).then((res) => {
              alert("Entrou no then de cima! Res: " + res);
              participantData.push(res);
              res.data.brand.companies.forEach((company) => {
                this.genericLoans(company)[0].interestRates.forEach((interestRate) => {
                  interestRates.push(interestRate);
                });
              });
            });
          }
        });
        participant["participantData"] = participantData;
      });

      return interestRates;
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
  methods: {
    checkUrlAndFilteredType(url, type) {
      let result = false;

      if (type === "financing") {
        result =
          url.indexOf("invoice-financing") === -1 && url.indexOf(type) > -1;
      } else {
        result = url.indexOf(type) > -1;
      }

      return result;
    },
    toggleParticipantToComparison(participant) {
      const position = this.comparisonParticipants.findIndex(
        (x) => x.participantName === participant.RegisteredName
      );
      if (position === -1) {
        const participantUrls = this.participantUrls.find(
          (x) => x.participantName === participant.RegisteredName
        );
        this.comparisonParticipants.push(participantUrls);
      } else {
        this.comparisonParticipants.splice(position, 1);
      }
    },
    getParticipantClass(participant) {
      const position = this.comparisonParticipants.findIndex(
        (x) => x.participantName === participant.RegisteredName
      );
      let result = "participant";
      result += position > -1 ? "-selected" : "";
      return result;
    },
    async getData(url) {
      return await getUrlData({ url }).then((res) => {
        alert("Entrou no then! Data: " + res.data.data);
        this.dataObject = res.data;
        return res.data;
      });
    },
    genericLoans(company) {
      let result = {};
      Object.keys(company).forEach((key) => {
        if (key.indexOf("personal") > -1 || key.indexOf("business") > -1) {
          result = company[key];
        }
      });
      return result;
    },
  },
};
</script>

<style scoped>
.participant-selected {
  background-color: yellow;
}
</style>
