import { shallowMount } from "@vue/test-utils";
import ComparisonChart from "@/components/Comparison/ComparisonChart.vue";

describe("ComparisonChart.vue", () => {
  const wrapper = shallowMount(ComparisonChart, {
    methods: {
      // replacing createChart() method because of mounted lifecycle
      createChart: jest.fn(),
    },
  });
  it("should renders correct text from parameters - returnThInterestOrClientRate", () => {
    expect(wrapper.vm.returnThInterestOrClientRate(4)).toBe("% Clientes");
    expect(wrapper.vm.returnThInterestOrClientRate(5)).toBe("Juros");
    expect(wrapper.vm.returnThInterestOrClientRate(2)).toBe("% Clientes");
    expect(wrapper.vm.returnThInterestOrClientRate(3)).toBe("Juros");
  });
  it("should renders correct text from parameters - getIndexerText", () => {
    const cdi = "FLUTUANTES_CDI";
    const prefix = "PRE_FIXADO";
    const interestRate1 = { rate: 0.089, referentialRateIndexer: cdi };
    const interestRate2 = { rate: 1.0, referentialRateIndexer: cdi };
    const interestRate3 = { rate: "NA", referentialRateIndexer: prefix };
    expect(wrapper.vm.getIndexerText(interestRate1)).toBe(
      " - FLUTUANTES_CDI / 8%"
    );
    expect(wrapper.vm.getIndexerText(interestRate2)).toBe(
      " - FLUTUANTES_CDI / 100%"
    );
    expect(wrapper.vm.getIndexerText(interestRate3)).toBe(" - " + prefix);
  });
  it("should return proper response to companyColors calls - companyColors", () => {
    const nameAndIndexerType = "Company Test";
    const whiteColor = "#FFFFFF";
    const objColorMap = {
      nameAndIndexerType,
      backgroundColor: whiteColor,
      borderColor: whiteColor,
    };
    const colorMap = [objColorMap];
    const typeTests = [
      wrapper.vm.companyColors(nameAndIndexerType, 1, colorMap),
      wrapper.vm.companyColors("Another Company", 1, colorMap),
      wrapper.vm.companyColors(nameAndIndexerType, 2, colorMap),
    ];
    expect(typeTests[0].backgroundColor).toBe(whiteColor);
    expect(typeTests[0].borderColor).toBe(whiteColor);
    expect(typeTests[1]).toBe(undefined);
    expect(typeTests[2].backgroundColor === whiteColor).toBeFalsy();
    expect(typeTests[2].borderColor === whiteColor).toBeFalsy();
  });
  it("should return proper response to participantCreditData calls - participantCreditData", () => {
    const creditDatas = [
      [
        { type: "loan", someValue: "1" },
        { type: "financing", someValue: "1" },
      ],
      [
        { type: "financing", someValue: "2" },
        { type: "loan", someValue: "2" },
      ],
      [
        { type: "financing", someValue: "3" },
        { type: "loan", someValue: "3" },
      ],
      [
        { type: "loan", someValue: "3" },
        { type: "financing", someValue: "3" },
      ],
      [
        { type: "loan", someValue: "4" },
        { type: "financing", someValue: "4" },
      ],
    ];
    const participant1 = {
      participantCreditData: creditDatas[0],
      participantId: "1",
    };
    const participant2 = {
      participantCreditData: creditDatas[1],
      participantId: "2",
    };
    const participant3 = {
      participantCreditData: creditDatas[2],
      participantId: "3",
    };
    const participant4 = {
      participantCreditData: creditDatas[3],
      participantId: "4",
    };
    const participant5 = {
      participantCreditData: creditDatas[4],
      participantId: "5",
    };
    const participants = [
      participant1,
      participant2,
      participant3,
      participant4,
    ];
    const creditTypes = ["loan", "financing", "other"];
    const typeTests = [
      wrapper.vm.participantCreditData(
        participant1,
        participants,
        creditTypes[0]
      ),
      wrapper.vm.participantCreditData(
        participant2,
        participants,
        creditTypes[1]
      ),
      wrapper.vm.participantCreditData(
        participant3,
        participants,
        creditTypes[2]
      ),
      wrapper.vm.participantCreditData(
        participant4,
        participants,
        creditTypes[0]
      ),
      wrapper.vm.participantCreditData(
        participant5,
        participants,
        creditTypes[0]
      ),
    ];
    expect(typeTests[0]).toBe(creditDatas[0][0]);
    expect(typeTests[1]).toBe(creditDatas[1][0]);
    expect(typeTests[2]).toBe(undefined);
    expect(typeTests[3]).toBe(creditDatas[3][0]);
    expect(typeTests[4]).toBe(undefined);
  });
  it("should return correct data - getParticipantChartData", () => {
    const interestRate = {
      referentialRateIndexer: "PRE_FIXADO",
      rate: "N/A",
      applications: [
        {
          interval: "1_FAIXA",
          indexer: { rate: "0.03" },
          customers: { rate: "0.0020" },
        },
        {
          interval: "2_FAIXA",
          indexer: { rate: "0.07" },
          customers: { rate: "0.0030" },
        },
        {
          interval: "3_FAIXA",
          indexer: { rate: "0.075" },
          customers: { rate: "0.25" },
        },
        {
          interval: "4_FAIXA",
          indexer: { rate: "0.1350" },
          customers: { rate: "0.7450" },
        },
      ],
      minimumRate: "0.003",
      maximumRate: "0.1399",
    };
    const expectedIndexer = ["0.30", "3.00", "7.00", "7.50", "13.50", "13.99"];
    const expectedCustomers = [
      "0.00",
      "0.20",
      "0.30",
      "25.00",
      "74.50",
      "0.00",
    ];
    const resultIndexer = wrapper.vm.getParticipantChartData(
      interestRate,
      "indexer"
    );
    const resultCustomers = wrapper.vm.getParticipantChartData(
      interestRate,
      "customers"
    );

    for (let i = 0; i < expectedIndexer.length; i++) {
      expect(resultIndexer[i]).toBe(expectedIndexer[i]);
    }
    for (let i = 0; i < expectedCustomers.length; i++) {
      expect(resultCustomers[i]).toBe(expectedCustomers[i]);
    }
  });
  it("should return correct data - getDataSetCustomers", () => {
    const label = "Label 1";
    const interestRate = {
      referentialRateIndexer: "PRE_FIXADO",
      rate: "N/A",
      applications: [
        {
          interval: "1_FAIXA",
          indexer: { rate: "0.03" },
          customers: { rate: "0.0020" },
        },
        {
          interval: "2_FAIXA",
          indexer: { rate: "0.07" },
          customers: { rate: "0.0030" },
        },
        {
          interval: "3_FAIXA",
          indexer: { rate: "0.075" },
          customers: { rate: "0.25" },
        },
        {
          interval: "4_FAIXA",
          indexer: { rate: "0.1350" },
          customers: { rate: "0.7450" },
        },
      ],
      minimumRate: "0.003",
      maximumRate: "0.1399",
    };
    const companyColors = { backgroundColor: "blue", borderColor: "red" };

    const result = wrapper.vm.getDataSetCustomers(
      label,
      interestRate,
      companyColors
    );
    expect(result.label).toBe(label);
    expect(result.type).toBe("bar");
    expect(result.order).toBe(2);
    expect(result.yAxisID).toBe("customers");
    expect(result.backgroundColor).toBe("blue");
    expect(result.borderColor).toBe(undefined);
  });
  it("should return correct data - getDataSetInterest", () => {
    const label = "Label 1";
    const interestRate = {
      referentialRateIndexer: "PRE_FIXADO",
      rate: "N/A",
      applications: [
        {
          interval: "1_FAIXA",
          indexer: { rate: "0.03" },
          customers: { rate: "0.0020" },
        },
        {
          interval: "2_FAIXA",
          indexer: { rate: "0.07" },
          customers: { rate: "0.0030" },
        },
        {
          interval: "3_FAIXA",
          indexer: { rate: "0.075" },
          customers: { rate: "0.25" },
        },
        {
          interval: "4_FAIXA",
          indexer: { rate: "0.1350" },
          customers: { rate: "0.7450" },
        },
      ],
      minimumRate: "0.003",
      maximumRate: "0.1399",
    };
    const companyColors = { backgroundColor: "blue", borderColor: "red" };

    const result = wrapper.vm.getDataSetInterest(
      label,
      interestRate,
      companyColors
    );
    expect(result.label).toBe(label);
    expect(result.type).toBe("line");
    expect(result.order).toBe(1);
    expect(result.yAxisID).toBe("interest");
    expect(result.backgroundColor).toBe("blue");
    expect(result.borderColor).toBe("red");
  });
  it("should return correct data - fillDataSets", () => {
    const participantData = { companyName: "Test Company" };
    const interestRate = {
      referentialRateIndexer: "PRE_FIXADO",
      rate: "N/A",
      applications: [
        {
          interval: "1_FAIXA",
          indexer: { rate: "0.03" },
          customers: { rate: "0.0020" },
        },
        {
          interval: "2_FAIXA",
          indexer: { rate: "0.07" },
          customers: { rate: "0.0030" },
        },
        {
          interval: "3_FAIXA",
          indexer: { rate: "0.075" },
          customers: { rate: "0.25" },
        },
        {
          interval: "4_FAIXA",
          indexer: { rate: "0.1350" },
          customers: { rate: "0.7450" },
        },
      ],
      minimumRate: "0.003",
      maximumRate: "0.1399",
    };
    const colorMap = [
      {
        nameAndIndexerType: participantData.companyName,
        backgroundColor: "whiteColor",
        borderColor: "whiteColor",
      },
    ];

    let dataSets = wrapper.vm.fillDataSets(
      [],
      participantData,
      interestRate,
      1,
      colorMap
    );
    expect(dataSets).toBeDefined();
  });
});
