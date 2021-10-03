<template>
  <div class="main">
    <hr />
    <table class="table-data">
      <tr>
        <th colspan="9">Crédito: {{ this.creditType }}</th>
      </tr>
      <tr>
        <th>Empresa</th>
        <th>Indexador</th>
        <th>Rate</th>
        <th>Mínimo</th>
        <th>Faixa 1</th>
        <th>Faixa 2</th>
        <th>Faixa 3</th>
        <th>Faixa 4</th>
        <th>Máximo</th>
      </tr>
      <template v-for="participant in participants">
        <tr :key="participant.participantId">
          <td
            :rowspan="
              participantCreditData(participant).interestRates.length + 1
            "
          >
            <strong>
              {{ participantCreditData(participant).companyName }}
            </strong>
          </td>
        </tr>
        <tr
          v-for="interestRate in participantCreditData(participant)
            .interestRates"
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
export default {
  name: "ComparisonTable",
  props: {
    participants: Array,
    creditType: String,
  },
  data() {
    return {
      filterCreditType: "",
      filterPersonType: "both",
      participantsLocal: [],
      dataTables: "",
      creditTypesSelected: [],
      stringsToFillTable: [
        "indexerType",
        "indexerRate",
        "minimum",
        "1",
        "2",
        "3",
        "4",
        "maximum",
      ],
    };
  },
  methods: {
    participantCreditData(participant) {
      const participantLocal = this.participants.find(
        (x) => x.participantId === participant.participantId
      );
      return participantLocal.participantCreditData.find(
        (x) => x.type === this.creditType
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
              (x) => x.interval.indexOf(typeData) > -1
            ).indexer.rate
          );
          break;
      }
      return result;
    },
    formatToPercentage(number) {
      return Number.isNaN(Number(number))
        ? "NA"
        : (number * 100).toFixed(2) + "%";
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
