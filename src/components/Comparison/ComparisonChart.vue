<template>
  <div class="main">
    <h2>{{ creditType }}</h2>
    <canvas :id="creditType"></canvas>
  </div>
</template>

<script>
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

export default {
  name: "ComparisonChart",
  props: {
    participants: Array,
    creditType: String,
    colorMap: Array,
  },
  mounted() {
    const ctx = document.getElementById(this.creditType);
    new Chart(ctx, this.getCreditTypeData);
  },
  computed: {
    getChartDataSets() {
      const localParticipants = this.participants;
      let dataSets = [];
      localParticipants.forEach((participant) => {
        const participantData = this.participantCreditData(participant);
        let count = 1;
        participantData.interestRates.forEach((interestRate) => {
          const nameAndIndexerType =
            participantData.companyName + this.getIndexerText(interestRate);

          let label = nameAndIndexerType + " - Clientes (1 / 10)";
          let companyColors = this.companyColors(
            participantData.companyName,
            count++
          );
          let dataSetCustomers = {
            label,
            data: this.getParticipantChartData(interestRate, "customers"),
            backgroundColor: companyColors.backgroundColor,
            borderWidth: 3,
            type: "bar",
            order: 2,
          };
          label = nameAndIndexerType + " - Juros (% mensal)";
          let dataSetInterest = {
            label,
            data: this.getParticipantChartData(interestRate, "indexer"),
            backgroundColor: companyColors.backgroundColor,
            borderColor: companyColors.borderColor,
            borderWidth: 3,
            type: "line",
            order: 1,
          };
          dataSets.push(dataSetInterest, dataSetCustomers);
        });
      });
      return dataSets;
    },
    getCreditTypeData() {
      return {
        type: "line",
        data: {
          labels: [
            "Mínimo",
            "Faixa 1",
            "Faixa 2",
            "Faixa 3",
            "Faixa 4",
            "Máximo",
          ],
          datasets: this.getChartDataSets,
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25,
                },
              },
            ],
          },
        },
      };
    },
  },
  methods: {
    getIndexerText(interestRate) {
      const interestRateType = this.multiplyBy(interestRate.rate,100);
      let text = " - " + interestRate.referentialRateIndexer;
      text +=
        interestRateType === "NA"
          ? ""
          : " / " + interestRateType.split(".")[0] + "%";
      return text;
    },
    getParticipantChartData(interestRate, dataType) {
      let result = [];
      let minimumRate = 0;
      let maximumRate = 0;

      if (dataType === "indexer") {
        minimumRate = this.multiplyBy(interestRate.minimumRate, 100);
        maximumRate = this.multiplyBy(interestRate.maximumRate, 100);
      }

      result.push(minimumRate);

      for (let i = 1; i < 5; i++) {
        const rate = interestRate.applications.find(
          (x) => x.interval.indexOf(i) > -1
        )[dataType].rate;

        if (dataType === "indexer") {
          result.push(this.multiplyBy(rate, 100));
        } else {
          result.push(this.multiplyBy(rate, 10));
        }
      }

      result.push(maximumRate);
      return result;
    },
    companyColors(nameAndIndexerType, length) {
      let result = this.colorMap.find(
          (x) => x.nameAndIndexerType === nameAndIndexerType
      );

      if (length > 1) {
        result.backgroundColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        result.borderColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
      }

      return result;
    },
    returnThInterestOrClientRate(i) {
      return i % 2 === 0 ? "% Clientes" : "Juros";
    },
    participantCreditData(participant) {
      const participantLocal = this.participants.find(
        (x) => x.participantId === participant.participantId
      );
      return participantLocal.participantCreditData.find(
        (x) => x.type === this.creditType
      );
    },
    multiplyBy(number, multiply) {
      return Number.isNaN(Number(number))
        ? "NA"
        : (number * multiply).toFixed(2);
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
