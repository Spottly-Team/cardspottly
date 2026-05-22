/** Config pubblica Firebase (override con .env.local / Netlify in produzione) */
export const firebaseClientDefaults = {
  apiKey: "AIzaSyBcEtbdkhEiqPPj8hY_l4fzkZdATaDIxeE",
  /** Deve coincidere col dominio dell'app (Safari blocca redirect cross-domain). */
  authDomain: "card.appspottly.com",
  projectId: "card-spottly",
  storageBucket: "card-spottly.firebasestorage.app",
  messagingSenderId: "545897166782",
  appId: "1:545897166782:web:c9a53edff8ac337ef6abef",
};
