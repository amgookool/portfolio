import { initializeApp } from 'firebase/app'
import type { Analytics } from 'firebase/analytics'
import { getAnalytics } from 'firebase/analytics'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB3H1sFXZuEoCqjdh3bEMXiYkJAxFmAI74',
  authDomain: 'amgookool-portfolio.firebaseapp.com',
  projectId: 'amgookool-portfolio',
  storageBucket: 'amgookool-portfolio.firebasestorage.app',
  messagingSenderId: '406641606493',
  appId: '1:406641606493:web:f7fa8538973eca795072b4',
  measurementId: 'G-XTQYR5RLNR',
}

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

// Dev only: route Firestore to the local emulator (firebase.json -> port 8080).
// `import.meta.env.DEV` is statically `false` in the prod/SSG build, so Vite
// strips this whole block from the deployed bundle.
if (import.meta.env.DEV) {
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
}

// Analytics is browser-only. Because SSG also runs this module in Node at build
// time, guard on `window` (not just PROD) or the prerender pass will crash.
const analytics: Analytics | null =
  import.meta.env.PROD && typeof window !== 'undefined'
    ? getAnalytics(app)
    : null

export { app, analytics, firestore }
