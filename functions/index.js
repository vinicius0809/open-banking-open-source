const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();
const regionFunctions = functions
  .runWith({ timeoutSeconds: 60, memory: "128MB" })
  .region("southamerica-east1").https;

exports.getUrlData = regionFunctions.onCall(async (data) => {
  let getData = {};
  functions.logger.info("Chamando URL: " + data.url);
  await axios
    .get(data.url)
    .then((result) => {
      getData = {
        message: "sucesso ao buscar",
        data: result,
        msgStatus: "success",
      };
    })
    .catch((error) => {
      getData = {
        message: error.message,
        msgStatus: "error",
        data: "sem resposta",
      };
    })
    .finally(() => {
      functions.logger.info(getData);
    });

  return getData.data.data;
});

/*
exports.updateParticipants = regionFunctions.onCall(
    async (data) => {
        functions.logger.info(data);
        if (data) {
            let jsObject = data;
            let message = "Houve erro ao realizar transação!";
            jsObject.insertDate = admin.firestore.FieldValue.serverTimestamp();
            const participantsRef = admin.firestore().collection("participants");
            await participantsRef
                .add(jsObject)
                .then(async () => {
                    await participantsRef.orderBy("insertDate", "asc")
                        .limit(1)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                participantsRef.doc(doc.id).delete()
                                    .then(() => {
                                        message = "Participantes atualizados e mais antigo excluído!";
                                    })
                            });
                        })

                })
                .catch((error) => {
                    functions.logger.info(error.message);
                    throw new functions.https.HttpsError('unknown', error.message, error);
                })
                .finally(() => {
                    functions.logger.info(message);
                    return message;
                })
        }
        else {
            const msg = "Erro ao receber JSON!";
            functions.logger.info(msg);
            return msg;
        }
    });
*/
