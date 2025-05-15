import { SceneManager, ImageManager } from "./source/scenemanager.js";

const font = new Font("default");


function arcadeSceneUpdate() {

const font = new Font("default");
font.scale = 1.0f;

font.outline_color = Color.new(0, 0, 0);

const bgm = Sound.Stream("source/background.wav")

os.chdir("render");

Screen.setVSync(true);

const canvas = Screen.getMode();
canvas.zbuffering = true;
canvas.psmz = Screen.Z16S;
Screen.setMode(canvas);

Render.setView(60.0, 5.0, 4000.0);


const map = new RenderData("Untitled.obj");
map.pipeline = Render.PL_NO_LIGHTS;
map.textures.forEach(texture => {
    texture.filter = LINEAR;
});

const map_object = new RenderObject(map);

const water = new RenderData("water.obj");
water.pipeline = Render.PL_NO_LIGHTS;

water.textures.forEach(texture => {
    texture.filter = LINEAR;
});
const water_object = new RenderObject(water);

const palm = new RenderData("palm.obj");
palm.pipeline = Render.PL_NO_LIGHTS;
palm.textures.forEach(texture => {
    texture.filter = LINEAR;
});
const palm_object = new RenderObject(palm);
palm_object.position = {x: 0.0f, y: -2.0f, z: 0.0f}; 

const coconut = new RenderData("coconut.obj");
coconut.pipeline = Render.PL_NO_LIGHTS;
coconut.textures.forEach(texture => {
    texture.filter = LINEAR;
});

const coconut_object = new RenderObject(coconut);
coconut_object.position = {x: 0.0f, y: 0.0f, z: 0.0f}; 

Camera.type(Camera.LOOKAT);
Camera.position(0.0f, 15.0f, 35.0f);
Camera.rotation(0.0f, 0.0f, 0.0f);

const light = Lights.new();
Lights.set(light, Lights.DIRECTION, 0.0, 0.5, 1.0);
Lights.set(light, Lights.DIFFUSE, 0.5, 0.5, 0.5);
Lights.set(light, Lights.SPECULAR, 1.0, 1.0, 1.0);

let pad = Pads.get();
let rx = null;
let ry = null;

let cameraAngleX = 0.0f;
let cameraAngleY = 0.0f; 
let cameraDistance = 20.0f;

let ee_info = System.getCPUInfo();
let free_mem = `RAM: ${Math.floor(System.getMemoryStats().used / 1048576)}MB / ${Math.floor(ee_info.RAMSize / 1048576)}MB`;
let free_vram = Screen.getFreeVRAM();

const gray = Color.new(152, 245, 249)
let bbox = false;
let currentModel = 1; 

let startTime = Date.now();
let currentScore = 0;

while(true) {
    Screen.clear(gray);
    pad.update();

    
    rx = ((pad.rx > 25 || pad.rx < -25) ? pad.rx : 0) / 200.0f;
    ry = ((pad.ry > 25 || pad.ry < -25) ? pad.ry : 0) / 200.0f;
    

    cameraAngleX -= rx * 3.0f;  
    cameraAngleY -= ry * 3.0f;  
    

    cameraAngleY = Math.max(0.0f, Math.min(80.0f, cameraAngleY));

  
    const radX = cameraAngleX * (Math.PI / 180.0);
    const radY = cameraAngleY * (Math.PI / 180.0);
    
    const camX = cameraDistance * Math.sin(radX) * Math.cos(radY);
    const camY = cameraDistance * Math.sin(radY) + 5.0f; 
    const camZ = cameraDistance * Math.cos(radX) * Math.cos(radY);
    
 
    Camera.position(camX, camY, camZ);
    Camera.target(0.0f, 0.0f, 0.0f); 
    Camera.update();


    map_object.render();
    water_object.render()
    palm_object.render()

  
    coconut_object.render();

      
       const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    currentScore = elapsedTime;
      
      font.print(10, 350, "Score: " + currentScore);
     
    

Sound.setVolume(80); 


bgm.play();

if (pad.justPressed(Pads.START)) {
        SceneManager.load(logoUpdate)
      }


    Screen.flip();
}
}

function logoUpdate() {
  const title = new Image("source/title.png");
  const screenWidth = Screen.getMode().width;
  

  const buttons = [
    { x: screenWidth / 4, y: 230, label: "ARCADE MODE" },
    { x: (screenWidth / 4) * 3, y: 230, label: "REALISTIC MODE" }
  ];
  
  let selectedIndex = 0;
  

  const normalBackColor = Color.new(40, 39, 7, 20);
  const selectedBackColor = Color.new(70, 60, 10, 80);
  const normalTextColor = Color.new(255, 255, 255, 128);
  const selectedTextColor = Color.new(255, 220, 0, 180);
  
  const pad = Pads.get(0);
  

  const font = new Font("default");
  
  
  let inTransition = false;
  let transitionAlpha = 0;
  let selectedMode = null;
  
  Screen.display(() => {

    pad.update();
    
    if (inTransition) {
     
      transitionAlpha += 15;
      

      Draw.rect(0, 0, Screen.getMode().width, Screen.getMode().height, 
                Color.new(0, 0, 0, Math.min(transitionAlpha, 128)));
      

      if (transitionAlpha >= 128) {
        if (selectedMode === 0) {
          SceneManager.load(arcadeSceneUpdate);
        } else {
          SceneManager.load(realisticModeUpdate);
        }
      }
      
      return; 
    }
    
 
    if (pad.justPressed(Pads.LEFT) && selectedIndex > 0) {
      selectedIndex--;
    }
    
    if (pad.justPressed(Pads.RIGHT) && selectedIndex < buttons.length - 1) {
      selectedIndex++;
    }
    

    if (pad.justPressed(Pads.CROSS)) {
    
      inTransition = true;
      selectedMode = selectedIndex;
    }
    
   
    title.draw(0, 0);
    

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const rectWidth = 293;
      const rectHeight = 50;
      const rectX = button.x - (rectWidth / 2);
      const rectY = button.y;
      
      
      const backColor = (i === selectedIndex) ? selectedBackColor : normalBackColor;
      Draw.rect(rectX, rectY, rectWidth, rectHeight, backColor);
      
     
      font.color = (i === selectedIndex) ? selectedTextColor : normalTextColor;
      

      const textSize = font.getTextSize(button.label);
      const textX = button.x - (textSize.width / 2);
      const textY = rectY + (rectHeight - textSize.height) / 2;
      

      font.print(textX, textY, button.label);
    }
  });
}

function realisticModeUpdate() {

  const title = new Image("source/realisticmode.png");
  

  const font = new Font("default");
  font.scale = 1.0;
  font.color = Color.new(255, 255, 255, 255);
  

  let gameState = "title"; 
  let startTime = 0;
  let currentScore = 0;
  
  
  const pad = Pads.get(0);
  

  Screen.display(() => {

    pad.update();
    
    if (pad.justPressed(Pads.START)) {
        SceneManager.load(logoUpdate)
      }

    if (gameState === "title") {
      title.draw(0, 0);
      
      if (pad.justPressed(Pads.CROSS)) {
        gameState = "game";
        startTime = Date.now(); 
      }
    } 
    else if (gameState === "game") {

      Screen.clear(Color.new(0, 0, 0, 255));
      
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      currentScore = elapsedTime; 
      
      font.print(10, 350, "Score: " + currentScore);
      
      
    }
  });
}


SceneManager.load(logoUpdate);