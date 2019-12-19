// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


//  device_type = 1 ZEBRA
//  device_type = 2 NEWLAND

export const environment = {
  production: false,
  device_type: 2,
  serverEndpoint: " http://5dd8db89.ngrok.io",
  socketEndpoint: "http://10.201.233.240:6001",
  VPNserverEndpoint:"http://10.201.233.240/",
  VPNsocketEndpoint:"http://10.201.233.240:6001/",
  socketAlarm: true,
  dataSocket: false,
  impianti : [
        {
            "id": "1",
            "nome":"italprogetti",
            "codice_impianto": "qwerty",
            "codice_registrazione":"abc",
            "api_host": "10.201.233.239",
            "socket_host":"10.201.233.240"
        },
        {
          "id": "2",
          "nome":"italprogetti ngrok",
          "codice_impianto": "qwertyu",
          "codice_registrazione":"def",
          "api_host": "5dd8db89.ngrok.io",
          "socket_host":"10.201.233.240"
          
      }],
};
