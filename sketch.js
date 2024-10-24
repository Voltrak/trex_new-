var trex ,trex_running, trex_collided, trex_agacharse;
var suelo, sueloimagen;
var sueloinvicible;
var nube;
var obstaculo;
var nubeimagen;
var obstaculo, Imgobstaculo1, Imgobstaculo2, Imgobstaculo3, Imgobstaculo4, Imgobstaculo5, Imgobstaculo6
var Ptero, ImagenPtero;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var obstacleGroup, cloudsGroup;
var gameoverImg, restrarImg, gameover, restart;
var sonidosalto, sonidomuerte, checkpoint;
function preload(){
  trex_running  = loadAnimation("trex1.png","trex3.png","trex4.png")
  trex_agacharse= loadAnimation("trex_agacharse1.png","trex_agacharse2.png")
  ImagenPtero   = loadAnimation("pterodactilo_1.png","pterodactilo_2.png")
  sueloimagen   = loadImage("ground2.png")
  nubeimagen    = loadImage("cloud.png");
  Imgobstaculo1 = loadImage("obstacle1.png");
  Imgobstaculo2 = loadImage("obstacle2.png");
  Imgobstaculo3 = loadImage("obstacle3.png");
  Imgobstaculo4 = loadImage("obstacle4.png");
  Imgobstaculo5 = loadImage("obstacle5.png");
  Imgobstaculo6 = loadImage("obstacle6.png");
  sonidomuerte  = loadSound("die.mp3")
  sonidosalto   = loadSound("jump.mp3")
  checkpoint    = loadSound("checkpoint.mp3")

  gameOverImg = loadImage("gameover.png")
  restartImg = loadImage("restart.png")
  trex_collided = loadImage("trex_collided.png");
}

function setup(){
  createCanvas(600,200)
  
  // para una imagen es addimage y para dos o mas es addanimation
  //crear sprite de Trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("correr",trex_running)
  //mostrar animacion del trex 
  trex.addImage("collided", trex_collided);

    //animacion de agacharse
    trex.addAnimation("agacharse",trex_agacharse);
  
    //poner escala a la animacion 
  trex.scale=0.5

  //colisionadior del sprite trex"area de colicion"
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  suelo = createSprite(200,180,400,20)
  suelo.addImage("suelo", sueloimagen)
  sueloinvicible = createSprite(200,190,400,10)
  sueloinvicible.visible = false;



  //crea grupo de obstaculos y nubes
  obstacleGroup = new Group();
  cloudsGroup = new Group();

  //sprite para el gameOver
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5
  gameOver.visible = false;

  //sprite para el retart
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

 }

function draw(){
  background("wite")
  text("puntuacion: " + score, 500, 50);
  
//los estoados de juego mejor conoicidos como "gameState" son los 
// que definen como va a estar tu juego y son 3 el de sever, play y end en ocaciones puedes usar solo el end y play
//el de server es por ejemplo cuando eliges el personaje, la pista, carros e incusive el menu etc
//ply es cuando ya empieza el juego a funcionar 
//y end es cuando ya termina el juego por ejemplo cuando mueres y se reinicia tambien conocido como "gameover"
  if(gameState === PLAY){
    //mover el suelo
     suelo.velocityX = -(4 + score/100);
     //genera la puntuacion con el uso del frame 
     score = score + Math.round(getFrameRate()/60);
    //Verifica si la variable score es mayor que 0 y si es un multiplo de 100
    //Si amabas son condiciones son verdaderas, ejecuta el metodo chechPoint.play().
     if(score > 0 && score % 100 === 0){
      checkpoint.play();
     }
     //Reinicia el suelo
     if(suelo.x<0){
      suelo.x = suelo.width/2;
    } 
    //tecla para detectar el salto
  if(keyDown ("space") && trex.y >=120){
    trex.changeAnimation("correr",trex_running)
    trex.velocityY = -10
    //para poner los sonidos 
    //a play se le puede conciderar un evento
    //tecla para agacharse 

    sonidosalto.play();
   }
   else{
    trex.changeAnimation("correr",trex_running)
   }
  trex.velocityY = trex.velocityY + 0.8 

  //llamador de las funciones de las nubes
  spawnClouds();
  //llamador de los obstaculos
  spawnObstaculos();
  //llamado de la funcion de Pterodactilos
  MostrarPtrodactilos();

 //sirve para darle buelta al sprite prinsipal en este caso el trex
  if(keyDown("DOWN_ARROW") && trex.x >= 50){ 
  trex.rotation=360;
  trex.changeAnimation("agacharse",trex_agacharse)
 trex.scale=0.36
 trex.velocityY=0
 trex.y = trex.y + 7
 }else{
  trex.rotation=360;
  trex.changeAnimation("correr",trex_running)
  trex.scale=0.5
 }
  //condicion para detectar el choque del trex con los obstaculos 
  if(obstacleGroup.isTouching(trex)){
    gameState = END
    sonidomuerte.play();
  }
  }

  else if(gameState === END){
    //detener el suelo
    suelo.velocityX = 0;

    //cambiar la animacion a otra por ejemplo cambi la imagen de trex por la de la colicion 
    trex.changeAnimation("collided",trex_collided);
    trex.scale=0.5

    //detener la velocidad de los grupos de los obstaculos y las nubes
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  // afecta igual el tiempo de vida del grupo y al poner un num negatiovo no van a desapareser y al mismo 
  //no van a llenar el espacio de memoria.
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    //detener la velocidad del trex
    trex.velocityY = 0;

    if(mousePressedOver(restart)){
     reset();
    }
  }
     trex.collide(sueloinvicible);
  drawSprites();
  }
//creacion de las funciones de la nubes
//Math.round hace el redondeo de puntos decimales 
//Math es el invocador de las operaciones matematicas como el round o el random etc. 
function spawnClouds(){
  if(frameCount % 60 === 0){
    nube = createSprite((Math.round(random(300,600))),100,40,10);
    nube.addImage(nubeimagen);
    nube.scale = 0.4;
    nube.y = Math.round(random(10,100))
    nube.velocityX = -(3 + score/100);

    //ajustar la profundidad 
    //depth en la profundidad
    nube.depth = trex.depth
    trex.depth = trex.depth +1
    //asicninar lifetime (ciclo de vida) a la nube
    nube.lifetime = 210
    //agrega cada nube al grupo
    cloudsGroup.add(nube);

    /*console.log(trex.depth)
    console.log(nube.depth);*/
  }
}
function spawnObstaculos(){
  if(frameCount % 60 === 0){
    obstaculo = createSprite(600,165,10,40)
    obstaculo.velocityX = -(6 + score/100);
  
    //switch no esta limitado a uno es mas parecido a la palanca del carro de varias opciones(es ermano de la condicion if)
  var rango = Math.round(random(1,6));
  switch(rango){
    case 1: obstaculo.addImage(Imgobstaculo1);
            break;
    case 2: obstaculo.addImage(Imgobstaculo2);
            break;
    case 3: obstaculo.addImage(Imgobstaculo3);
            break;
    case 4: obstaculo.addImage(Imgobstaculo4);
            break;
    case 5: obstaculo.addImage(Imgobstaculo5);
            break;
    case 6: obstaculo.addImage(Imgobstaculo6);
            break;        
  //break es como un romperlo osea no se detiene el codigo solo pasa al siguente
  default: break ;
  //default es para finalizar el switch
   }
   obstaculo.scale = 0.6;
   obstaculo.lifetime = 210
   //agregar cada obstaculo al grupo
   obstacleGroup.add(obstaculo);
  }
}
function reset(){
  gameState = PLAY=false;
  gameOver.visible=false;
  restart.visible=false;

  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("correr",trex_running);
  score = 0;

}
function MostrarPtrodactilos(){
  if(frameCount % 600 === 0){
    Ptero = createSprite(600, 100, 40, 10)
    Ptero.addAnimation("Ptero_animation",ImagenPtero);
    Ptero.velocityX = -(6 + score/100)
    
  }

}