<template>
  <div class="main">
    <table class="table-data">
      <caption>
        Comparação de dados para o tipo de crédito
        {{
          this.creditType
        }}
      </caption>
      <tr>
        <th colspan="13" scope="colgroup">Crédito: {{ this.creditType }}</th>
      </tr>
      <tr>
        <th rowspan="2" scope="col">Empresa</th>
        <th rowspan="2" scope="col">Indexador</th>
        <th rowspan="2" scope="col">Taxa</th>
        <th rowspan="2" scope="col">Mínimo</th>
        <th colspan="2" scope="col">Faixa 1</th>
        <th colspan="2" scope="col">Faixa 2</th>
        <th colspan="2" scope="col">Faixa 3</th>
        <th colspan="2" scope="col">Faixa 4</th>
        <th rowspan="2" scope="col">Máximo</th>
      </tr>
      <tr>
        <th scope="colgroup" v-for="i in 8" :key="i">
          {{ returnThInterestOrClientRate(i) }}
        </th>
      </tr>
      <template v-for="participant in participants">
        <tr :key="participant.participantId">
          <td
            :rowspan="
              participantCreditData(participant, participants, creditType)
                .interestRates.length + 1
            "
          >
            <strong>
              {{
                participantCreditData(participant, participants, creditType)
                  .companyName
              }}
            </strong>
          </td>
        </tr>
        <tr
          v-for="interestRate in participantCreditData(
            participant,
            participants,
            creditType
          ).interestRates"
          :key="interestRate.companyName"
        >
          <td v-for="str in stringsToFillTable" :key="str">
            {{ generateTdData(interestRate, str) }}
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import { multiplyByIfNumber } from "../../methods/utils";

export default {
  name: "ComparisonTable",
  props: {
    participants: Array,
    creditType: String,
  },
  data() {
    return {
      filterCreditType: "",
      graphView: false,
      filterPersonType: "both",
      participantsLocal: [],
      dataTables: "",
      creditTypesSelected: [],
      stringsToFillTable: [
        "indexerType",
        "indexerRate",
        "minimum",
        "indexer-1",
        "customers-1",
        "indexer-2",
        "customers-2",
        "indexer-3",
        "customers-3",
        "indexer-4",
        "customers-4",
        "maximum",
      ],
    };
  },
  methods: {
    returnThInterestOrClientRate(i) {
      return i % 2 === 0 ? "% Clientes" : "Juros";
    },
    participantCreditData(participant, participants, creditType) {
      const participantLocal = participants.find(
        (x) => x.participantId === participant.participantId
      );
      return participantLocal.participantCreditData.find(
        (x) => x.type === creditType
      );
    },
    generateTdData(interestRate, typeData) {
      let result = "";
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
              (x) => x.interval.indexOf([typeData.split("-")[1]]) > -1
            )[typeData.split("-")[0]].rate
          );
          break;
      }
      return result;
    },
    formatToPercentage(number) {
      let result = multiplyByIfNumber(number, 100);
      result += result === "NA" ? "" : "%";
      return result;
    },
  },
};
</script>

<style>
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
