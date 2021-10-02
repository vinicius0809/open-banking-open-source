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
    </div>
    <div class="credit-type" v-if="filterCreditType">
      <hr />
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
    <div
      class="comparison-data"
      v-if="comparisonParticipants.length > 0"
      v-html="renderTables"
    ></div>
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
      filterPersonType: "both",
      participantsLocal: [],
      dataTables: "",
      creditTypesSelected: [],
    };
  },
  computed: {
    comparisonParticipants() {
      return this.participantsLocal.filter((x) => x.toCompare);
    },
    ...mapState(["participants"]),
    renderTables() {
      let html = "";
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

      this.creditTypesSelected.forEach((creditType) => {
        const comparisonFilteredByCreditType =
          this.comparisonParticipants.filter((x) =>
            x.participantCreditTypes.includes(creditType)
          );
        if (comparisonFilteredByCreditType.length > 0) {
          let headerTable = "".concat(
            "<hr><table class='table-data'>",
            "<tr><th colspan='9'>Crédito: ",
            creditType,
            "</th></tr><tr>",
            "<th>Empresa</th>",
            "<th>Indexador</th>",
            "<th>Rate</th>",
            "<th>Mínimo</th>",
            "<th>Faixa 1</th>",
            "<th>Faixa 2</th>",
            "<th>Faixa 3</th>",
            "<th>Faixa 4</th>",
            "<th>Máximo</th></tr>"
          );
          let endTable = "</table>";
          let midTable = "";
          const stringsToFillTable = [
            "indexerType",
            "indexerRate",
            "minimum",
            "1",
            "2",
            "3",
            "4",
            "maximum",
          ];
          comparisonFilteredByCreditType.forEach((participant) => {
            const datas = participant.participantCreditData.filter(
              (x) => x.type === creditType
            );
            datas.forEach((data) => {
              const name = "<tr><td rowspan='".concat(
                data.interestRates.length + 1,
                "'><strong>",
                data.companyName,
                "</strong></td>"
              );
              midTable = midTable.concat(name);

              data.interestRates.forEach((interestRate) => {
                midTable = midTable.concat("<tr>");
                stringsToFillTable.forEach((str) => {
                  midTable = midTable.concat(
                    this.generateTdData(interestRate, str)
                  );
                });
                midTable = midTable.concat("</tr>");
              });

              midTable = midTable.concat("</tr>");
            });
          });
          html = html.concat(headerTable, midTable, endTable);
        }
      });
      return html;
    },
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
                      participantData: [],
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
    clearObjects() {
      this.comparisonParticipants.forEach((participant) => {
        participant.toCompare = false;
        participant.participantData = [];
      });
    },
    generateTdData(interestRate, typeData) {
      let result = "<td>";
      switch (typeData) {
        case "minimum":
          result += this.formatToPercentage(interestRate.minimumRate);
          break;
        case "maximum":
          result += this.formatToPercentage(interestRate.maximumRate);
          break;
        case "indexerRate":
          result += this.formatToPercentage(interestRate.rate);
          break;
        case "indexerType":
          result += interestRate.referentialRateIndexer;
          break;
        default:
          result += this.formatToPercentage(
            interestRate.applications.find(
              (x) => x.interval.indexOf(typeData) > -1
            ).indexer.rate
          );
          break;
      }
      result += "</td>";
      return result;
    },
    formatToPercentage(number) {
      return Number.isNaN(Number(number))
        ? "NA"
        : (number * 100).toFixed(2) + "%";
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

      this.comparisonParticipants.forEach((participant) => {
        if (
          participant.participantData === null ||
          participant.participantData.length < 1
        ) {
          participant.participantUrls.forEach(async (obj) => {
            if (
              this.filterPersonType === "both" ||
              obj.url.indexOf(this.filterPersonType) > -1
            ) {
              obj.data = await this.getData(obj.url).then((res) => {
                return res.data;
              });
            }
          });
        }
      });
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
  background-color: yellow;
  padding: 8px;
}
.participant {
  padding: 8px;
}
.table-data {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.table-data td,
.table-data th {
  border: 1px solid #ddd;
  padding: 8px;
}

.table-data tr:hover {
  background-color: #ddd;
}

.table-data th {
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: #04aa6d;
  color: white;
  text-align: center;
}
</style>
