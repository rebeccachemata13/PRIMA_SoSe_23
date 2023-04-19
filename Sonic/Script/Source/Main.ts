namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    shadowNodeInit(_event);
  }

  //Sprite Animations
  let shadowWalkAnimation: ƒAid.SpriteSheetAnimation;
  let shadowRunAnimation: ƒAid.SpriteSheetAnimation;
  let shadowJumpAnimation: ƒAid.SpriteSheetAnimation;
  let shadowDeathAnimation: ƒAid.SpriteSheetAnimation;

  function initAnimations(coat: ƒ.CoatTextured): void {
    shadowWalkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    shadowWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 85 , 40, 45), 4, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

    shadowRunAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
    shadowRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 140, 40, 45), 5, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

    shadowJumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
    shadowJumpAnimation.generateByGrid(ƒ.Rectangle.GET(540, 380 , 40, 45), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

    shadowDeathAnimation= new ƒAid.SpriteSheetAnimation("Die", coat);
    shadowDeathAnimation.generateByGrid(ƒ.Rectangle.GET(43, 400, 20, 45), 1, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
  }

  let audioJump: ƒ.Audio;
  // let audioMusic: ƒ.Audio;
  // let audioDeath: ƒ.Audio;

  function initializeSounds(): void {
    // audioDeath = new ƒ.Audio("./Sounds/death.wav");
    audioJump = new ƒ.Audio("./Sounds/jump.wav");
    // audioMusic = new ƒ.Audio("./Sounds/music.wav");
  }

  //shadowSprite
  let shadowAvatar: ƒAid.NodeSprite;
  let cmpAudio: ƒ.ComponentAudio;
  

  async function shadowNodeInit(_event: Event): Promise<void> {
    let shadowSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await shadowSpriteSheet.load("./sprites/shadow_sprite_sheet.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, shadowSpriteSheet);

    initAnimations(coat);
    initializeSounds();

    shadowAvatar = new ƒAid.NodeSprite("shadow_Sprite");
    shadowAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));

    shadowAvatar.setAnimation(shadowWalkAnimation);
    shadowAvatar.setFrameDirection(1);
    shadowAvatar.framerate = 20;
    
    shadowAvatar.mtxLocal.translateY(-0.2);
    shadowAvatar.mtxLocal.translateZ(0.001);
    shadowAvatar.mtxLocal.scaleX(0.5);
    shadowAvatar.mtxLocal.scaleY(0.5);


    graph = viewport.getBranch();
    graph.addChild(shadowAvatar);

    cmpAudio = graph.getComponent(ƒ.ComponentAudio);
    cmpAudio.connect(true);
    cmpAudio.volume = 1;

    // cmpAudio.setAudio(audioMusic);
    // cmpAudio.play(true);
    // cmpAudio.volume = 1;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);

  }

  const xSpeedDefault: number = 2;
  const xSpeedSprint: number = 3;
  const jumpForce: number = 5.5;
  let ySpeed: number = 0;
  let gravity: number = 9.81;
  

  let animationState: string = "stand";
  let dead: boolean = false;

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    ySpeed -= gravity * deltaTime;
    let yOffset: number = ySpeed * deltaTime;
    shadowAvatar.mtxLocal.translateY(yOffset);

    let pos: ƒ.Vector3 = shadowAvatar.mtxLocal.translation;
    if (pos.y < -1 && !dead) {
      dead = true;
      // cmpAudio.setAudio(audioDeath);
      // cmpAudio.play(true);
      shadowAvatar.setAnimation(shadowDeathAnimation);
      ySpeed = jumpForce * .8;
      viewport.draw();
      return;
    }
    // If dead, stop game and reset page
    if (dead) {
      // cmpAudio.volume = 10;
      pos.y = -2;
      window.location.reload();
      viewport.draw();
      return;
    }

    checkCollision();

    let speed: number = xSpeedDefault;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
      speed = xSpeedSprint;
    }
    // Calculate travel distance
    const moveDistance = speed * ƒ.Loop.timeFrameGame / 1000;

    // Check for key presses and move player accordingly
    checkInput(moveDistance, speed);

    // Rotate based on direction
    shadowAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("Left") ? 180 : 0);

    // Jumping
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
      cmpAudio.setAudio(audioJump);
      cmpAudio.play(true);
      cmpAudio.volume = 4;
      ySpeed = jumpForce;
      
    }
   

    if (ySpeed > 0) {
      animationState = "jump";
      shadowAvatar.setAnimation(shadowJumpAnimation);
      shadowAvatar.showFrame(0);
    }
    if (ySpeed < 0) {
      animationState = "jump";
      shadowAvatar.setAnimation(shadowJumpAnimation);
      shadowAvatar.showFrame(2);
    }

    if (ySpeed === 0 && animationState.includes("jump")) {
      shadowAvatar.setAnimation(shadowWalkAnimation);
      animationState = "walk";
    }


    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkInput(moveDistance: number, speed: number): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      shadowAvatar.mtxLocal.translateX(moveDistance);
      if (speed > xSpeedDefault && animationState !== "sprintRight") {
        shadowAvatar.setAnimation(shadowRunAnimation);
        animationState = "sprintRight";
        return;
      }
      if (speed <= xSpeedDefault && animationState !== "walkRight") {
        shadowAvatar.setAnimation(shadowWalkAnimation);
        animationState = "walkRight";
        return;
      }
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      shadowAvatar.mtxLocal.translateX(moveDistance);
      if (speed > xSpeedDefault && animationState !== "sprintLeft") {
        shadowAvatar.setAnimation(shadowRunAnimation);
        animationState = "sprintLeft";
        return;
      }
      if (speed <= xSpeedDefault && animationState !== "walkLeft") {
        shadowAvatar.setAnimation(shadowWalkAnimation);
        animationState = "walkLeft";
        return;
      }
      return;
    }

    if (animationState.includes("stand")) {
      shadowAvatar.setAnimation(shadowWalkAnimation);
      shadowAvatar.showFrame(0);
      return;
    }
    animationState = `stand ${animationState.includes("Left") && "Left"}`;
  }

 function checkCollision(): void {
    graph = viewport.getBranch();
    let floors: ƒ.Node = graph.getChildrenByName("Floors")[0];
    let pos: ƒ.Vector3 = shadowAvatar.mtxLocal.translation;
    for (let floor of floors.getChildren()) {
      let posFloor: ƒ.Vector3 = floor.mtxLocal.translation;
      if (Math.abs(pos.x - posFloor.x) < 0.5) {
        if (pos.y < posFloor.y + 0.01) {
          pos.y = posFloor.y + 0.01;
          shadowAvatar.mtxLocal.translation = pos;
          ySpeed = 0;

        }
      }
    }
  }
}