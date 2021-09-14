import { FUNCTIONS } from "@/firebase/app";
import store from "@/store/index.js";

export async function getParticipants() {
  store.dispatch("startLoading");
  const url =
    "https://data.directory.openbankingbrasil.org.br/participants";
  const getUrlData = FUNCTIONS.httpsCallable("getUrlData");
  await getUrlData({ url })
    .then((result) => {
      store.dispatch("setParticipants", orderedByNameParticipants(result.data));
    })
    .finally(() => store.dispatch("stopLoading"));
}

function orderedByNameParticipants(participants) {
  return participants.sort(function (a, b) {
    return a.RegisteredName.localeCompare(b.RegisteredName);
  });
}