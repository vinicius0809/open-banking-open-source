const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });
// const https = require('https');
admin.initializeApp();
const regionFunctions = functions
    .runWith({ timeoutSeconds: 60, memory: "128MB" })
    .region("southamerica-east1").https;

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

exports.getParticipants = regionFunctions.onCall(async (data, context) => {
    functions.logger.info("Chamada recebida => ", data, context);
    const participantsRef = admin.firestore().collection("participants");
    let participants = [];
    let message = "Erro ao buscar participantes!"

    await participantsRef
        .orderBy("insertDate", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                functions.logger.info("Doc.data() =>" + doc.data());
                participants = doc.data().data;
            });
            message = "Sucesso ao obter participantes!"
        })
        .catch((error) => {
            functions.logger.info(error.message);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .finally(() => {
            functions.logger.info(message);
            functions.logger.info(participants);
        });

    return participants;
});

// exports.updatePage = regionFunctions.onCall(async (data, context) => {
//     const baseURI = String.toString(data);

//     return new Promise((resolve, reject) => {
//         const request = https.get((baseURI, (res) => {
//             res.on('data', (d) => {
//                 functions.logger.info("Teste do logs!");
//                 functions.logger.info(d);
//                 return "funciona!"
//             });
//             res.on('end', resolve);
//         }));
//         request.on('error', reject);
//     });
// });

// exports.test = regionFunctions.onRequest((request, response) => {
//     const baseURI = 'https://api.itau/open-banking/products-services/v1/personal-accounts'
//     this.$http.get(baseURI)
//         .then((result) => {
//             functions.logger.info("Teste do logs!");
//             functions.logger.info(result.data);
//             response.send(result.data);
//         })
// })

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
