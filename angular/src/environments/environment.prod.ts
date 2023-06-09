import packageJson from '../../package.json';

export const environment = {
  production: true,
  appAuthEndpoint: 'https://auth.crm4retail.ru/tnt',
  appBonusEndpoint: 'https://customerapi2.mi.crm4retail.ru/json.rpc/',
  appWPEndpoint: 'http://213.239.210.240:4500/wp-json/woofood/v1/',
  hasBonusProgram: true,
  systemId: 'StyrkNFW9vKga1KlJP',
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
  webhookItRetail: 'https://sakura.lk.crm4retail.ru/api/orders/handlers/tillda/115eaf95-bb44-4cfc-851a-fec5325b45ff',
  icardProxy: 'https://sakura.lk.crm4retail.ru/api/icard-proxy/',
  clientName: 'sakura',
  cities: ['Менделеевск'],
  sakuraApi: 'sakura.ru-academy.online/api/'
}
