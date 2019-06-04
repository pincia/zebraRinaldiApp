import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PushService } from 'src/app/services/push.service';
import { DataService } from 'src/app/services/data.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
@Component({
  selector: 'app-odp',
  templateUrl: './odp.page.html',
  styleUrls: ['./odp.page.scss'],
})


export class OdpPage implements OnInit {
  private id_odp:any;
  private odp:any;
  private isLoaded:any;
  pdfObj = null;
  logo_path:any;
  private image:any;
  drum:any;
  base64Img:any;
  displaySpinner:any;
  constructor(private filePath: FilePath, private platform: Platform, private file: File, private fileOpener: FileOpener,private dataService: DataService, private pushservice: PushService,private route: ActivatedRoute,private http:HttpClient) {
    this.displaySpinner = "block";
    this.isLoaded=false;
    this.route.paramMap
    .subscribe((queryParams: ParamMap) => {
       this.id_odp = queryParams.get('idodp');     
       this.drum = pushservice.drumsdata[0];
       console.log(this.id_odp);
       console.log(this.drum);
    });


    
  }

  ngOnInit() {
    console.log(environment.serverEndpoint+'/getodp/'+this.id_odp);
    this.http.get(environment.serverEndpoint+'/getodp/'+this.id_odp)
    .subscribe(data => 
      {
        console.log(data);
      this.odp=data;
      this.displaySpinner = "none";
      this.isLoaded=true;
      
      this.filePath.resolveNativePath('/assets/images/pdf.png')
  .then(
    
    filePath => this.logo_path = filePath)
    
  .catch(err => console.log(err));


      this.convertImgToBase64URL("https://i.ibb.co/F3NSB0F/logo.png", (base64Img)=>{
        this.base64Img=base64Img;
        
    },"image/png");
    })
    

  }


  createPdf(base64Img) {
    console.log("BASE64 IMAGE");
    console.log(base64Img);
    console.log(this.odp);
   var body = [];
    var j=1;
    //body[0]=["PASSO","DESCRIZIONE","RPM","Tc","Tw","Tp","C°"]
    body[0]=[{text: 'PASSO', style: 'tableHeader'}, {text: 'DESCRIZIONE', style: 'tableHeader'}, {text: 'RPM', style: 'tableHeader'}, {text: 'Tc', style: 'tableHeader'}, {text: 'Tw', style: 'tableHeader'}, {text: 'Tp', style: 'tableHeader'}, {text: 'C°', style: 'tableHeader'}];
				
    for (let step of this.odp) {
      console.log(step);
      body[j]=[""+step.PASSO,step.DESCRIZIONE,step.RUOTA_RPM,step.DURATA,step.RUOTA_GIRA,step.RUOTA_FERMO,step.RUOTA_TEMP];
      j++;
  }
 
    console.log(body);

    var docDefinition = {
      content: [
        {image:base64Img, alignment:'right', margin: [ 0, 0, 0, 20 ]},
        { text: 'ODP '+this.id_odp, style: 'header' },
       // { text: new Date().toTimeString(), alignment: 'center' },
        { text: 'DRUM '+this.drum.NOME, style: 'subheader',alignment: 'center' },
       
      
        {
          style: 'tableExample',
          table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [ 50,120,40,40,40,40,40 ],
  
          body: body,
        
        },
        layout: 'headerLineOnly'
      }
      ],
      styles: {
        header: {
          fontSize: 24,
          alignment: 'center',
          bold: true,
        },
        tableHeader:{
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 5, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },

        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  downloadPDF() {
    console.log("CREATE PDF");
    this.createPdf(this.base64Img);
    console.log("DOWNLOAD PDF");
    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
 
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'ODP'+this.id_odp+'.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'ODP'+this.id_odp+'.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

    convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas =<HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}



}
