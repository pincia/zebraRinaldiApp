/*
* Copyright (C) 2018 Zebra Technologies Corp
* All rights reserved.
*/

import { Injectable } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
@Injectable()

export class BarcodeService {

  private requestResultCodes = "false";
device_type:any;
barcodeManager=window['barcodeManager'];
  constructor(device:Device, public events: Events, private platform: Platform, storage: Storage) {
    this.device_type=3;
    storage.set("DEVICE_TYPE",3)
    this.barcodeManager.addReadListner(
      (data) => {
      console.log("PUBBLICO  "+data)
       this.events.publish('data:scan', JSON.parse(data));
      },
      (err)=>{
        alert(err);
      }
   );

    if (device.manufacturer.includes('Zebra')){
      this.device_type=1
     storage.set("DEVICE_TYPE",1)
    }
    if (device.manufacturer.includes('Newl')){
      this.device_type=2
      storage.set("DEVICE_TYPE",2)
    }
   


    
    this.platform.ready().then((readySource) => {



      let constructorInstance = this;

      //  The Datawedge service will respond via implicit broadcasts intents.  
      //  Responses may be the result of calling the Datawedge API or may be because a barcode was scanned
      //  Set up a broadcast receiver to listen for incoming scans
      (<any>window).plugins.intentShim.registerBroadcastReceiver({
        filterActions: [
          'nlscan.action.SCANNER_RESULT',
          'it.italprogetti.zebraapp.ACTION',           //  Response from scan (needs to match value in output plugin)
          'com.symbol.datawedge.api.RESULT_ACTION',//  Response from DataWedge service (as defined by API)
          
        ],/*
        filterCategories: [
          'android.intent.category.DEFAULT'
        ]*/
      },
      function (intent) {
     
        //  Broadcast received
        
        //  Emit a separate event for the result associated with this scan.  This will only be present in response to
        //  API calls which included a SEND_RESULT extra
        
        //CASO SCANNER NEWLAND
        storage.get("DEVICE_TYPE").then((val)=>{
          if (intent.extras.hasOwnProperty('SCAN_BARCODE1')&&val==2) {
            //  A barcode has been scanned
            console.log("RICEVUTO  INTENT "+intent.extras)
            console.log("INVIO DATASCAN SCAN_BARCODE1")
            constructorInstance.events.publish('data:scan', intent, new Date().toLocaleTimeString());
          }
          if (!intent.extras.hasOwnProperty('RESULT_INFO')&&val==1) {
            //  A barcode has been scanned
            console.log("INVIO DATASCAN RESULT_INFO")
            constructorInstance.events.publish('data:scan', intent, new Date().toLocaleTimeString());
          }

        })
       


        //CASO SCANNER ZEBRA
        if (intent.extras.hasOwnProperty('RESULT_INFO') ) {
          let commandResult = intent.extras.RESULT + " (" +
            intent.extras.COMMAND.substring(intent.extras.COMMAND.lastIndexOf('.') + 1, intent.extras.COMMAND.length) + ")";  // + JSON.stringify(intent.extras.RESULT_INFO);
          constructorInstance.events.publish('data:commandResult', commandResult.toLowerCase());
        }

        if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_VERSION_INFO')) {
          //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX  
          var versionInfo = intent.extras['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
          console.log('Verssion Info: ' + JSON.stringify(versionInfo));
          let datawedgeVersion = versionInfo['DATAWEDGE'];
          console.log("Datawedge version: " + datawedgeVersion);

          //  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
          if (datawedgeVersion >= "6.3")
            constructorInstance.events.publish('status:dw63ApisAvailable', true);
          if (datawedgeVersion >= "6.4")
            constructorInstance.events.publish('status:dw64ApisAvailable', true);
          if (datawedgeVersion >= "6.5")
            constructorInstance.events.publish('status:dw65ApisAvailable', true);
        }
        else if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS')) {
          //  Return from our request to enumerate the available scanners
          let enumeratedScanners = intent.extras['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
          constructorInstance.events.publish('data:enumeratedScanners', enumeratedScanners);
        }
        else if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
          
          //  Return from our request to obtain the active profile
          let activeProfile = intent.extras['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
          console.log("ACTIVE PROFILE "+activeProfile);
          constructorInstance.events.publish('data:activeProfile', activeProfile);
        }
      
       
      }
      );

    });

  }

  //  Control whether or not to include the SEND_RESULT extra in our commands to request DW send the
  //  result back to us.  Only available in DW6.5+
  requestResult(requestCodes: boolean) {
    this.requestResultCodes = "" + requestCodes;
  }

  //  Send a broadcast intent to the DW service which is present on all Zebra devcies.
  //  This functionality requires DW6.3+ as that is the version where the com.symbol.datawedge.api.ACTION
  //  was introduced.
  //  extraValue may be a String or a Bundle
  sendCommand(extraName: string, extraValue) {
    console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
    (<any>window).plugins.intentShim.sendBroadcast({
     
     action: 'com.symbol.datawedge.api.ACTION',
    
      extras: {
        [extraName]: extraValue,
        "SEND_RESULT": this.requestResultCodes
      }
    },
      function () { },  //  Success in sending the intent, not success of DW to process the intent.
      function () { }   //  Failure in sending the intent, not failure of DW to process the intent.
    );
  }
  sendCommandNewland() {
      (<any>window).plugins.intentShim.sendBroadcast({
      action: 'nlscan.action.SCANNER_TRIG',

      extras: {
        "SCAN_TIMEOUT": 4,
        "SCAN_TYPE": 1
      }
    },
      function () { },  //  Success in sending the intent, not success of DW to process the intent.
      function () { }   //  Failure in sending the intent, not failure of DW to process the intent.
    );
  }

}

