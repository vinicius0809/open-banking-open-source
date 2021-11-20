import { shallowMount } from "@vue/test-utils";
import ComparisonTable from "@/components/Comparison/ComparisonTable.vue";

describe("ComparisonTable.vue", () => {
  const wrapper = shallowMount(ComparisonTable);
  it("should renders correct text from parameters - returnThInterestOrClientRate", () => {
    expect(wrapper.vm.returnThInterestOrClientRate(4)).toBe("% Clientes");
    expect(wrapper.vm.returnThInterestOrClientRate(5)).toBe("Juros");
    expect(wrapper.vm.returnThInterestOrClientRate(2)).toBe("% Clientes");
    expect(wrapper.vm.returnThInterestOrClientRate(3)).toBe("Juros");
  });
  it("should renders correct text from parameters - formatToPercentage", () => {
    expect(wrapper.vm.formatToPercentage(4)).toBe("400.00%");
    expect(wrapper.vm.formatToPercentage("4")).toBe("400.00%");
    expect(wrapper.vm.formatToPercentage("0.03")).toBe("3.00%");
    expect(wrapper.vm.formatToPercentage(0.0048)).toBe("0.48%");
    expect(wrapper.vm.formatToPercentage("asd")).toBe("NA");
    expect(wrapper.vm.formatToPercentage(null)).toBe("NA");
  });
  it("should return correct data - participantCreditData", () => {
    const testParticipants = [
      { participantId: "0" },
      { participantId: "1" },
      { participantId: "2" },
    ];
    const participantsToFind = [
      { participantId: "0", participantCreditData: [{ type: "loan" }] },
      { participantId: "1", participantCreditData: [{ type: "financing" }] },
      { participantId: "2" },
    ];

    expect(
      wrapper.vm.participantCreditData(
        testParticipants[0],
        participantsToFind,
        "loan"
      )
    ).toBeDefined();
    expect(
      wrapper.vm.participantCreditData(
        testParticipants[1],
        participantsToFind,
        "loan"
      )
    ).toBeUndefined();
    expect(() => {
      wrapper.vm.participantCreditData(
        testParticipants[2],
        participantsToFind,
        "anything"
      );
    }).toThrow(TypeError);
  });
  it("should return correct data - generateTdData", () => {
    const interestRate = {
      minimumRate: 0.005,
      maximumRate: 0.05,
      rate: 1,
      referentialRateIndexer: "FLUTUANTES_CDI",
      applications: [
        {
          interval: "FAIXA_1",
          indexer: { rate: 0.01 },
          customers: { rate: 0.011 },
        },
        {
          interval: "FAIXA_2",
          indexer: { rate: 0.02 },
          customers: { rate: 0.022 },
        },
        {
          interval: "FAIXA_3",
          indexer: { rate: 0.03 },
          customers: { rate: 0.033 },
        },
        {
          interval: "FAIXA_4",
          indexer: { rate: 0.04 },
          customers: { rate: 0.044 },
        },
      ],
    };

    expect(wrapper.vm.generateTdData(interestRate, "minimum")).toBe("0.50%");
    expect(wrapper.vm.generateTdData(interestRate, "maximum")).toBe("5.00%");
    expect(wrapper.vm.generateTdData(interestRate, "indexerRate")).toBe(
      "100.00%"
    );
    expect(wrapper.vm.generateTdData(interestRate, "indexerType")).toBe(
      "FLUTUANTES_CDI"
    );
    expect(wrapper.vm.generateTdData(interestRate, "indexer-1")).toBe("1.00%");
    expect(wrapper.vm.generateTdData(interestRate, "customers-1")).toBe(
      "1.10%"
    );
    expect(wrapper.vm.generateTdData(interestRate, "indexer-2")).toBe("2.00%");
    expect(wrapper.vm.generateTdData(interestRate, "customers-2")).toBe(
      "2.20%"
    );
    expect(wrapper.vm.generateTdData(interestRate, "indexer-3")).toBe("3.00%");
    expect(wrapper.vm.generateTdData(interestRate, "customers-3")).toBe(
      "3.30%"
    );
    expect(wrapper.vm.generateTdData(interestRate, "indexer-4")).toBe("4.00%");
    expect(wrapper.vm.generateTdData(interestRate, "customers-4")).toBe(
      "4.40%"
    );
  });
});
