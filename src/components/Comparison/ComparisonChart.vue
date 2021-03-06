<template>
  <div class="main">
    <h2>{{ creditType }}</h2>
    <canvas :id="creditType"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { mapState } from "vuex";
import { multiplyByIfNumber } from "../../methods/utils";

export default {
  name: "ComparisonChart",
  props: {
    participants: Array,
    creditType: String,
  },
  mounted() {
    this.createChart();
  },
  computed: {
    ...mapState(["colorMap"]),
    getChartDataSets() {
      const localParticipants = this.participants;
      let dataSets = [];
      localParticipants.forEach((participant) => {
        const participantData = this.participantCreditData(
          participant,
          this.participants,
          this.creditType
        );
        let count = 1;
        participantData.interestRates.forEach((interestRate) => {
          dataSets = this.fillDataSets(
            dataSets,
            participantData,
            interestRate,
            count++,
            this.colorMap
          );
        });
      });
      return dataSets;
    },
    getCreditTypeData() {
      const obj = {
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
            interest: {
              type: "linear",
              ticks: {
                beginAtZero: true,
              },
              position: "left",
              title: {
                display: true,
                text: "% Juros",
              },
            },
            customers: {
              type: "linear",
              ticks: {
                beginAtZero: true,
              },
              position: "right",
              title: {
                display: true,
                text: "% Clientes",
              },
            },
          },
        },
      };
      Chart.register(...registerables);
      return obj;
    },
  },
  methods: {
    createChart() {
      const ctx = document.getElementById(this.creditType);
      new Chart(ctx, this.getCreditTypeData);
    },
    fillDataSets(dataSets, participantData, interestRate, count, colorMap) {
      const nameAndIndexerType =
        participantData.companyName + this.getIndexerText(interestRate);

      let label = nameAndIndexerType + " - % Clientes";
      let companyColors = this.companyColors(
        participantData.companyName,
        count,
        colorMap
      );

      let dataSetCustomers = this.getDataSetCustomers(
        label,
        interestRate,
        companyColors
      );
      label = nameAndIndexerType + " - % Juros mensal";
      let dataSetInterest = this.getDataSetInterest(
        label,
        interestRate,
        companyColors
      );
      dataSets.push(dataSetInterest, dataSetCustomers);
      return dataSets;
    },
    getDataSetCustomers(label, interestRate, companyColors) {
      return {
        label,
        data: this.getParticipantChartData(interestRate, "customers"),
        backgroundColor: companyColors.backgroundColor,
        borderWidth: 3,
        type: "bar",
        order: 2,
        yAxisID: "customers",
      };
    },
    getDataSetInterest(label, interestRate, companyColors) {
      return {
        label,
        data: this.getParticipantChartData(interestRate, "indexer"),
        backgroundColor: companyColors.backgroundColor,
        borderColor: companyColors.borderColor,
        borderWidth: 3,
        type: "line",
        order: 1,
        yAxisID: "interest",
        lineTension: 0,
      };
    },
    getIndexerText(interestRate) {
      const interestRateType = multiplyByIfNumber(interestRate.rate, 100);
      let text = " - " + interestRate.referentialRateIndexer;
      text +=
        interestRateType === "NA"
          ? ""
          : " / " + interestRateType.split(".")[0] + "%";
      return text;
    },
    getParticipantChartData(interestRate, dataType) {
      let result = [];
      let minimumRate = "0.00";
      let maximumRate = "0.00";

      if (dataType === "indexer") {
        minimumRate = multiplyByIfNumber(interestRate.minimumRate, 100);
        maximumRate = multiplyByIfNumber(interestRate.maximumRate, 100);
      }

      result.push(minimumRate);

      for (let i = 1; i < 5; i++) {
        const rate = interestRate.applications.find(
          (x) => x.interval.indexOf(i) > -1
        )[dataType].rate;
        result.push(multiplyByIfNumber(rate, 100));
      }

      result.push(maximumRate);
      return result;
    },
    companyColors(nameAndIndexerType, length, colorMap) {
      let index = colorMap.findIndex(
        (x) => x.nameAndIndexerType === nameAndIndexerType
      );

      let result =
        index > -1
          ? {
              nameAndIndexerType: colorMap[index].nameAndIndexerType,
              backgroundColor: colorMap[index].backgroundColor,
              borderColor: colorMap[index].borderColor,
            }
          : undefined;

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
    participantCreditData(participant, participants, creditType) {
      const participantLocal = participants.find(
        (x) => x.participantId === participant.participantId
      );
      return participantLocal?.participantCreditData?.find(
        (x) => x.type === creditType
      );
    },
  },
};
</script>
