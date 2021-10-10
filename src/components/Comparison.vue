<template>
  <div class="main">
    <div class="filter-credit-type">
      <label for="filter-person-type">Filtrar por tipo de conta: </label>
      <select
        id="filter-person-type"
        v-model="filterPersonType"
        @change="clearObjects()"
      >
        <option value="both">Ambos</option>
        <option value="personal">Pessoa Física</option>
        <option value="business">Pessoa Jurídica</option>
      </select>
      <hr />
      <label for="filter-credit-type">Filtrar por tipo de crédito: </label>
      <select
        id="filter-credit-type"
        v-model="filterCreditType"
        @change="clearObjects()"
      >
        <option value="loan">Empréstimo</option>
        <option value="financing">Financiamento</option>
        <option value="invoice-financing">Antecipação de Recebíveis</option>
        <option value="credit-card">Cartão de Crédito</option>
      </select>
      <label v-if="creditTypesSelected.length > 0" class="checkbox">
        <input type="checkbox" v-model="graphView" />Visualização em
        gráfico</label
      >
    </div>
    <hr />
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
    <ComparisonTable
      class="comparison-data"
      v-for="creditType in creditTypesSelected"
      :key="creditType"
      :participants="comparisonFilteredByCreditType(creditType)"
      :creditType="creditType"
      :graphView="graphView"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getParticipants } from "../methods/participants";
import { getUrlData } from "../methods/firebaseFunctions";
import ComparisonTable from "./ComparisonViewer";

export default {
  name: "Comparison",
  components: {
    ComparisonTable,
  },
  data() {
    return {
      filterCreditType: "",
      filterPersonType: "both",
      participantsLocal: [],
      dataTables: "",
      creditTypesSelected: [],
      graphView: false,
    };
  },
  computed: {
    comparisonParticipants() {
      return this.participantsLocal.filter((x) => x.toCompare);
    },
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
                    this.filterCreditType,
                    this.filterPersonType
                  )
                ) {
                  let position = this.participantsLocal.findIndex(
                    (x) => x.participantName === participant.RegisteredName
                  );
                  if (position === -1) {
                    this.participantsLocal.push({
                      participantName: participant.RegisteredName,
                      participantId: participant.RegistrationId,
                      participantUrls: [],
                      toCompare: false,
                      participantCreditTypes: [],
                      participantCreditData: [],
                    });
                  }
                  position = this.participantsLocal.findIndex(
                    (x) => x.participantName === participant.RegisteredName
                  );
                  this.participantsLocal[position].participantUrls.push({
                    url: endpoint.ApiEndpoint,
                    data: {},
                  });

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
    updateColorMap() {
      let colorMap = [];
      this.comparisonParticipants.forEach((participant) => {
        participant.participantCreditData.forEach((creditData) => {
          if (
            colorMap.findIndex(
              (x) => x.nameAndIndexerType === creditData.companyName
            ) === -1
          ) {
            const backgroundColor =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
            const borderColor =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
            colorMap.push({
              nameAndIndexerType: creditData.companyName,
              backgroundColor,
              borderColor,
            });
          }
        });
      });
      this.setColorMap(colorMap);
    },
    ...mapActions(["startLoading", "stopLoading", "setColorMap"]),
    loadData() {
      this.comparisonParticipants.forEach((participant) => {
        participant.participantUrls.forEach((obj) => {
          obj?.data?.data?.brand?.companies.forEach((company) => {
            this.genericLoans(company).forEach((genericLoan) => {
              genericLoan["companyName"] = company.name;
              if (
                participant.participantCreditData.findIndex(
                  (x) =>
                    x.type === genericLoan.type &&
                    x.companyName === company.name
                ) === -1
              ) {
                participant.participantCreditData.push(genericLoan);
              }
              if (
                participant.participantCreditTypes.indexOf(genericLoan.type) ===
                -1
              ) {
                participant.participantCreditTypes.push(genericLoan.type);
              }
              if (this.creditTypesSelected.indexOf(genericLoan.type) === -1) {
                this.creditTypesSelected.push(genericLoan.type);
              }
            });
          });
        });
      });
      this.updateColorMap();
    },
    comparisonFilteredByCreditType(creditType) {
      return this.comparisonParticipants.filter((x) =>
        x.participantCreditTypes.includes(creditType)
      );
    },
    clearObjects() {
      this.creditTypesSelected = [];
      this.comparisonParticipants.forEach((participant) => {
        participant.toCompare = false;
      });
    },
    checkUrlAndFilteredType(url, type, personType) {
      let result = false;
      if (type === "financing") {
        result =
          url.indexOf("invoice-financing") === -1 &&
          url.indexOf(type) > -1 &&
          this.checkPersonType(url, personType);
      } else {
        result =
          url.indexOf(type) > -1 && this.checkPersonType(url, personType);
      }
      return result;
    },
    checkPersonType(url, personType) {
      return personType === "both" || personType === ""
        ? true
        : url.indexOf(personType) > -1;
    },
    toggleParticipantToComparison(participant) {
      const positionInParticipantsLocal = this.participantsLocal.findIndex(
        (x) => x.participantId === participant.RegistrationId
      );
      console.log(positionInParticipantsLocal);
      if (positionInParticipantsLocal > -1) {
        this.participantsLocal[positionInParticipantsLocal].toCompare =
          !this.participantsLocal[positionInParticipantsLocal].toCompare;
      }
      if (this.comparisonParticipants.length > 0) {
        this.comparisonParticipants.forEach((participant) => {
          participant.participantUrls.forEach(async (obj) => {
            if (
              this.filterPersonType === "both" ||
              obj.url.indexOf(this.filterPersonType) > -1
            ) {
              this.startLoading();
              await this.getData(obj.url)
                .then((res) => {
                  obj.data = res.data;
                  this.loadData();
                })
                .finally(() => this.stopLoading());
            }
          });
        });
      } else {
        this.clearObjects();
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
    getData(url) {
      return getUrlData({ url });
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

<style>
.participant-selected {
  background-color: #04aa6d;
  padding: 8px;
}
.participant {
  padding: 8px;
}
.checkbox {
  cursor: pointer;
}
</style>
