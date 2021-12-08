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
    />
  </div>
</template>

<script>
import ComparisonTable from "./ComparisonTable";
import ComparisonChart from "./ComparisonChart";
export default {
  name: "ComparisonViewer",
  components: {
    ComparisonTable,
    ComparisonChart,
  },
  props: {
    participants: Array,
    creditType: String,
    graphView: Boolean
  }
};
</script>

<style>
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
