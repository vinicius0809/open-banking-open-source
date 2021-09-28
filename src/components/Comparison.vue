<template>
  <div class="main">
    Dentro do componente
    <div class="filter-credit-type">
      <label for="filter-person-type">Filtrar por tipo de conta: </label>
      <select id="filter-person-type" v-model="filterPersonType">
        <option value="both">Ambos</option>
        <option value="pf">Pessoa Física</option>
        <option value="pj">Pessoa Jurídica</option>
      </select>
      <label for="filter-credit-type">Filtrar por tipo de crédito: </label>
      <select id="filter-credit-type" v-model="filterCreditType">
        <option value="loan">Empréstimo</option>
        <option value="financing">Financiamento</option>
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
    <div
      class="comparison-data"
      v-if="comparisonParticipants.length > 0"
      v-html="renderTables"
    >
      <!--      <table
        v-for="interestRate in interestRatesFromAllComparisonCompanies()"
        :key="interestRate.type"
      >
        <tr>
          <th>{{ interestRate.type }}</th>
        </tr>
      </table>-->
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
      filterPersonType: "both",
      participantUrls: [],
      filteredParticipants: [],
      comparisonParticipants: [],
      dataObject: null,
      dataTables: "",
      creditTypes: [],
      mapCreditTypesWithCompanies: [],
    };
  },
  computed: {
    ...mapState(["participants"]),
    renderTables() {
      let html = "";
      let comparison = this.comparisonParticipants;
      comparison.forEach((participant) => {
        participant.participantData.forEach((d) => {
          d?.data?.brand.companies.forEach((company) => {
            this.genericLoans(company).forEach((genericLoan) => {
              genericLoan["companyName"] = company.name;
              this.creditTypes.push(genericLoan);
            });
          });
        });
      });
      this.creditTypes.forEach((obj) => {
        const index = this.mapCreditTypesWithCompanies.findIndex((o) => {
          return o.type === obj.type;
        });
        if (index === -1) {
          // não existe este tipo de crédito na lista
          this.mapCreditTypesWithCompanies.push({
            type: obj.type,
            companiesInterestRates: [
              {
                companyName: obj.companyName,
                interestRates: obj.interestRates,
              },
            ],
          });
        } else {
          // existe este tipo de crédito na lista
          const mapCreditTypesWithCompanies = this.mapCreditTypesWithCompanies;
          const companies =
            mapCreditTypesWithCompanies[index].companiesInterestRates;
          const indexCompany = companies.findIndex((x) => {
            return x.companyName === obj.companyName;
          });
          if (indexCompany === -1) {
            // não existe essa empresa cadastrada
            this.mapCreditTypesWithCompanies[index].companiesInterestRates.push(
              {
                companyName: obj.companyName,
                interestRates: obj.interestRates,
              }
            );
          }
        }
      });

      this.mapCreditTypesWithCompanies.forEach((obj) => {
        const headerTable = "".concat(
          "<hr><table class='table-data'><tr><th colspan='9'>Crédito: ",
          obj.type,
          "</th></tr><tr><th>Empresa</th><th>Indexador</th><th>Rate</th><th>Mínimo</th><th>Faixa 1</th><th>Faixa 2</th><th>Faixa 3</th><th>Faixa 4</th><th>Máximo</th></tr>"
        );
        const endTable = "</table>";
        let midTable = "";
        obj.companiesInterestRates.forEach((company) => {
          const name = "<tr><td rowspan='".concat(
            company.interestRates.length + 1,
            "'><strong>",
            company.companyName,
            "</strong></td>"
          );
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
          midTable = midTable.concat(name);
          company.interestRates.forEach((interestRate) => {
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
        html = html.concat(headerTable, midTable, endTable);
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
    generateTdData(interestRate, typeData) {
      typeData = typeData.toString();
      let result = "<td>";
      switch (typeData) {
        case "minimum":
          result = result.concat(
            this.formatToPercentage(interestRate.minimumRate)
          );
          break;
        case "maximum":
          result = result.concat(
            this.formatToPercentage(interestRate.maximumRate)
          );
          break;
        case "indexerRate":
          result = result.concat(this.formatToPercentage(interestRate.rate));
          break;
        case "indexerType":
          result = result.concat(interestRate.referentialRateIndexer);
          break;
        default:
          result = result.concat(
            this.formatToPercentage(
              interestRate.applications.find(
                (x) => x.interval.indexOf(typeData) > -1
              ).indexer.rate
            )
          );
          break;
      }
      result = result.concat("</td>");
      return result;
    },
    formatToPercentage(number) {
      return Number.isNaN(Number(number))
        ? "NA"
        : (number * 100).toFixed(2) + "%";
    },
    checkUrlAndFilteredType(url, type, personType) {
      let result = false;
      if (personType === "both" || personType === "") {
        if (type === "financing") {
          result =
            url.indexOf("invoice-financing") === -1 && url.indexOf(type) > -1;
        } else {
          result = url.indexOf(type) > -1;
        }
      } else {
        personType = personType === "pf" ? "personal" : "business";
        if (type === "financing") {
          result =
            url.indexOf("invoice-financing") === -1 &&
            url.indexOf(type) > -1 &&
            url.indexOf(personType) > -1;
        } else {
          result = url.indexOf(type) > -1 && url.indexOf(personType) > -1;
        }
      }

      return result;
    },
    toggleParticipantToComparison(participant) {
      const positionInComparisonParticipants =
        this.comparisonParticipants.findIndex(
          (x) => x.participantName === participant.RegisteredName
        );
      const positionInParticipantUrls = this.participantUrls.findIndex(
          (x) => x.participantName === participant.RegisteredName
      );
      if (positionInComparisonParticipants === -1) {
        const participantUrls = this.participantUrls.find(
          (x) => x.participantName === participant.RegisteredName
        ).participantUrls;
        let obj = {
          participantData: [],
          participantUrls,
          participantName: participant.RegisteredName,
        };
        participantUrls.forEach(async (url) => {
          obj.participantData.push(
            await this.getData(url).then((res) => {
              return res.data;
            })
          );
        });
        this.comparisonParticipants.push(obj);
      } else {
        this.mapCreditTypesWithCompanies.forEach(creditType => {
          const index = creditType.companiesInterestRates.findIndex(c => c.companyName === participant.RegisteredName);
          creditType.companiesInterestRates.splice(index,1);
        });
        this.participantUrls.splice(positionInParticipantUrls, 1);
        this.comparisonParticipants.splice(positionInComparisonParticipants, 1);
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
      //  .then((res) => {
      //   return res.data;
      // });
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
  text-align: left;
  background-color: #04aa6d;
  color: white;
}
</style>
