<template>
  <div class="data">
    <div
      v-for="company in data.brand.companies"
      :key="company.cnpjNumber"
      class="company"
    >
      {{ company.name }}
      <div
        v-for="genericLoan in genericLoans(company)"
        :key="genericLoan.type"
        class="loan-types"
      >
        {{ genericLoan.type }}
        <div
          v-for="service in genericLoan.fees.services"
          :key="service.code"
          class="loan-services"
        >
          {{ service.code }}
          Minimum: R${{ service.minimum.value}} 
          Maximum: R${{ service.maximum.value}} 
        </div>
        <div
          v-for="interestRate in genericLoan.interestRates"
          :key="interestRate.referentialRateIndexer + interestRate.rate"
          class="loan-interest-rates"
        >
          {{ interestRate.referentialRateIndexer }}
          {{ toPercentage(interestRate.maximumRate) }} -
          {{ toPercentage(interestRate.minimumRate) }} - {{ toPercentage(interestRate.rate) }}
          <div
            v-for="application in interestRate.applications"
            :key="application.interval"
            class="loan-applications"
          >
            {{ application.interval }} Rate: {{ toPercentage(application.indexer.rate) }} -
            Customers: {{ toPercentage(application.customers.rate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
  methods: {
    toPercentage(number) {
      return (number * 100).toFixed(2) + "%";
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
</style>