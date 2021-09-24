<template>
  <div class="main">
    Dentro do componente
    <div class="filter-credit-type">
      <label for="filter-credit-type">Filtrar por tipo de crédito: </label>
      <select id="filter-credit-type" v-model="filterCreditType">
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
          const companies =            mapCreditTypesWithCompanies[index].companiesInterestRates;
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
          "<hr><table class='table-data'><tr><th colspan='7'>Crédito: ",
          obj.type,
          "</th></tr><tr><th>Empresa</th><th>Mínimo</th><th>Faixa 1</th><th>Faixa 2</th><th>Faixa 3</th><th>Faixa 4</th><th>Máximo</th></tr>"
        );
        const endTable = "</table>";
        let midTable = "";
        obj.companiesInterestRates.forEach((company) => {
          let name= "<tr><td rowspan='>".concat(company.interestRates.length+"'>",company.companyName,              "</td>");
          let minimum = this.generateTdData(company.interestRates, 'minimum');
          let maximum = this.generateTdData(company.interestRates, 'maximum');
          let layer1 = this.generateTdData(company.interestRates, '1');
          let layer2 = this.generateTdData(company.interestRates, '2');
          let layer3 = this.generateTdData(company.interestRates, '3');
          let layer4 = this.generateTdData(company.interestRates, '4');
          midTable = midTable.concat(name, minimum, layer1, layer2, layer3, layer4, maximum,"</tr>");
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
    generateTdData(interestRates, typeData){
      typeData = typeData.toString();
      let result = "";
      interestRates.forEach(interestRate => {
        result = result.concat("<td>",interestRates.length);
        switch (typeData) {
          case "minimum":
            result = result.concat(this.formatToPercentage(interestRate.minimumRate));
            break;
          case "maximum":
            result = result.concat(this.formatToPercentage(interestRate.maximumRate));
            break;
          default:
            result = result.concat(this.formatToPercentage(interestRate.applications.find(x => x.interval.indexOf(typeData) > -1).indexer.rate));
            break;
        }
        result = result.concat("</td>");
      });
      return result;
    },
    /*interestRatesFromAllComparisonCompanies() {
      let interestRates = [];
      this.comparisonParticipants.forEach((participant) => {
        let participantData = [];
        participant.participantUrls.forEach(async (url) => {
          if (this.checkUrlAndFilteredType(url, this.filterCreditType)) {
            participantData.push(this.getData(url).then((res) => {
              return res.data;
            }));

            participantData[
              participantData.length - 1
            ].data.brand.companies.forEach((company) => {
              let obj = this.genericLoans(company)[0];
              obj.interestRates.forEach((interestRate) => {
                interestRates.push(interestRate);
              });
            });
          }
        });
        participant["participantData"] = participantData;
      });
      return interestRates;
    },*/
    formatToPercentage(number){
      return (number * 100).toFixed(2) + "%";
    },
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

<style >
.participant-selected {
  background-color: yellow;
}
.table-data {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.table-data td, .table-data th {
  border: 1px solid #ddd;
  padding: 8px;
}

.table-data tr:nth-child(even){background-color: #f2f2f2;}

.table-data tr:hover {background-color: #ddd;}

.table-data th {
  padding-top: 8px;
  padding-bottom: 8px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}
</style>
