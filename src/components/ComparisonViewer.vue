<template>
  <div class="main">
    <hr />
    <ComparisonTable
      v-if="!graphView"
      :participants="participants"
      :credit-type="creditType"
    />
    <ComparisonChart
      v-else
      :participants="participants"
      :credit-type="creditType"
      :color-map="colorMap"
    />
  </div>
</template>

<script>
import ComparisonTable from "./ComparisonTable";
import ComparisonChart from "./ComparisonChart";
import {mapState} from "vuex";
export default {
  name: "ComparisonViewer",
  components: {
    ComparisonTable,
    ComparisonChart,
  },
  props: {
    participants: Array,
    creditType: String,
    graphView: Boolean,
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
      ]
    };
  },
  computed:{
    ...mapState(["colorMap"])
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

.graph-icon:hover {
  cursor: pointer;
  background-color: darkgreen;
}
</style>
