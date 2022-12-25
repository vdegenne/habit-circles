const admin = require('firebase-admin')
const serviceAccount = require('/home/oddant/Downloads/service-account-file.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const batch = app.firestore().batch()
batch.