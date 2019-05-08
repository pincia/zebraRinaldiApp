import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import * as BABYLON from 'babylonjs';

@Component({
  selector: 'app-drums',
  templateUrl: './drums.page.html',
  styleUrls: ['./drums.page.scss'],
})
export class DrumsPage implements OnInit {
  value = 0;
  drumdata:any;
  router:Router;
  scene:any;
  constructor(private dataService: DataService, private http:HttpClient, router:Router,private modalController:ModalController, private popoverController: PopoverController){
    this.router=router;
    this.getData();
    var interval = setInterval(()=>{ 
     this.getData();
    
    }, 5000);

  }

getData(){
    this.drumdata = this.dataService.drumsdata;
}




back() {
  //this.router.navigate(['menu/dashboard']);
}

trackByDrum(index,drum) { 
  return drum.ID; 
}
ngOnInit() {
  console.log("DRUMS PAGE ACTIVED");

 let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  console.log(canvas);
  var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
          // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 4, 1, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 2, 2, 1, scene);
      // Return the created scene.
      console.log(scene);
      return scene;
  }
   var scene = createScene();

    engine.runRenderLoop(function () {
      scene.render();
  });

  window.addEventListener('resize', function() {
    engine.resize();
});

   
  }


}
