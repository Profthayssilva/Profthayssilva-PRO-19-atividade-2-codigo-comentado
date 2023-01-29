var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  //Adicionar IA ao Trex
  // Aumentaremos o tamanho do colisor do Trex para que ele possa ver o obstáculo antes de realmente tocá-lo.
  // Sempre que o colisor do Trex tocar no obstáculo, faremos o Trex pular.
  trex.setCollider("rectangle",0,0,400,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //exibir pontuação
  text("Pontuaçao: "+ score, 500,50);
  
  console.log("isto é ",gameState)
  
  
  if(gameState === PLAY){
    //mover o solo
    gameOver.visible = false;
    restart.visible = false;
    //alterar a velocidade em 3
    ground.velocityX = -(4 + 3* score/100)
    //pontuação
    score = score + Math.round(frameCount/60);
    
    // Vamos usar % na pontuação e verificar se fica em0. Se for 0, tocaremos o som do ponto de verificação.
    //  precisamos ter certeza de que count > 0(contador). Podemos juntar essas duas condições usando && (operador E (AND)).
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla de espaço for pressionada
         // Quando o usuário pressiona a tecla de espaço, o Trex pula e o som do salto deve ser reproduzido.
    if(keyDown("space")&& trex.y >= 100) {
      //Assim que o raio do colisor for definido, a adicionaremos a condição de que quando um obstáculo estiver em contato com o Trex, o Trex irá pular e o som do salto será reproduzido.
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no solo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
       // trocar  trex.velocityY = -12 por 
       gameState = END; 
       // trocar jumpSound.play()por 
       dieSound.play(); //adiciona o 'som de morrer' quando o Trex colidir com o obstáculo.
       
       
      
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
      //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
     
      //definir a vida útil dos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   //à medida que avança e a pontuação do jogador aumenta. Digamos que aumentaremos em 1 toda vez que a pontuação do Trex aumentar em +100.
   //Em JavaScript, podemos simplesmente dividir apontuação por 100 e adicioná-la à velocidade.
   obstacle.velocityX = -(6 + score/100);
   //Estamos mudando a velocidade dos obstáculos e a mantendo negativa, porque queremos que os obstáculos se movam da direita para a esquerda na tela.

   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo              
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
    }
}

