import packageJson from '../../package.json';

export const environment = {
  production: false,
  appAuthEndpoint: 'https://testauth.crm4retail.ru/tnt',
  appBonusEndpoint: 'https://customerapi2.mi.crm4retail.ru/json.rpc/',
  appWPEndpoint: 'http://192.168.0.179:4200/wp-json/woofood/v1/',
  hasBonusProgram: true,
  systemId: 'g6zyv8tj53w28ov7cl',
  defaultUrl: 'http://192.168.0.179:4200',
  firebase: {
    apiKey: 'AIzaSyCnKvln5itnrBj62POCPHxshAN_Vmd0zds',
    authDomain: 'fashionlogicanotification.firebaseapp.com',
    projectId: 'fashionlogicanotification',
    storageBucket: 'fashionlogicanotification.appspot.com',
    messagingSenderId: '99855572145',
    appId: '1:99855572145:web:7548c189d61b3bcc92d690',
    measurementId: 'G-RQF97ZK7R1',
  },
  version: packageJson.version,
};
