import packageJson from '../../package.json';

export const environment = {
  production: true,
  appAuthEndpoint: 'https://auth.crm4retail.ru/tnt',
  appBonusEndpoint: 'https://customerapi2.mi.crm4retail.ru/json.rpc/',
  appWPEndpoint: 'http://213.239.210.240:4500/wp-json/woofood/v1/',
  hasBonusProgram: true,
  systemId: 'g6zyv8tj53w28ov7cl',
  defaultUrl: 'https://sakura.lk.crm4retail.ru',
  firebase: {
    apiKey: "AIzaSyCnKvln5itnrBj62POCPHxshAN_Vmd0zds",
    authDomain: "fashionlogicanotification.firebaseapp.com",
    projectId: "fashionlogicanotification",
    storageBucket: "fashionlogicanotification.appspot.com",
    messagingSenderId: "99855572145",
    appId: "1:99855572145:web:7548c189d61b3bcc92d690",
    measurementId: "G-RQF97ZK7R1"
  },
  version: packageJson.version,
  appleWalletEndpoint: 'https://apple-push-notifications.it-retail.tech/apns/api',
  appleWalletSecret: 'Token F5mbzEERAznGKVbB6l',
  webhookItRetail: 'https://webhook.it-retail.tech/handlers/tillda/1eb3fb56-3c4c-43b7-9a04-ce532ab7548f',
  clientName: 'Sakura',
  cities: ['Менделеевск'],
}
