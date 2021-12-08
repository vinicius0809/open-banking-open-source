import { shallowMount } from "@vue/test-utils";
import Participant from "@/components/Participant.vue";

describe("Participant.vue", () => {
  it("should renders correct text from props", () => {
    const companyName = "Test Company";
    const authorizationServers = ["1", "2"];
    const wrapper = shallowMount(Participant, {
      propsData: { companyName, authorizationServers },
    });
    const text = wrapper.text();
    expect(text).toContain(companyName);
    expect(text).toContain("Empresas: " + authorizationServers.length);
  });
});
