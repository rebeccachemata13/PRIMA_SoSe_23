namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    luigiNodeInit(_event);
  }

  //Sprite Animations
  let luigiWalkAnimation: ƒAid.SpriteSheetAnimation;
  let luigiRunAnimation: ƒAid.SpriteSheetAnimation;
  let luigiJumpAnimation: ƒAid.SpriteSheetAnimation;
  let luigiDeathAnimation: ƒAid.SpriteSheetAnimation;

  function initAnimations(coat: ƒ.CoatTextured): void {
    luigiWalkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    luigiWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));

    luigiRunAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
    luigiRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 245, 37, 45), 2, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

    luigiJumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
    luigiJumpAnimation.generateByGrid(ƒ.Rectangle.GET(320, 112, 37, 45), 1, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

    luigiDeathAnimation = new ƒAid.SpriteSheetAnimation("Die", coat);
    luigiDeathAnimation.generateByGrid(ƒ.Rectangle.GET(43, 400, 20, 45), 1, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
  }

  //LuigiSprite
  let luigiAvatar: ƒAid.NodeSprite;
  

  async function luigiNodeInit(_event: Event): Promise<void> {
    let luigiSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, luigiSpriteSheet);

    initAnimations(coat);

    luigiAvatar = new ƒAid.NodeSprite("luigi_Sprite");
    luigiAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));

    luigiAvatar.setAnimation(luigiWalkAnimation);
    luigiAvatar.setFrameDirection(1);
    luigiAvatar.framerate = 20;
    
    luigiAvatar.mtxLocal.translateY(-0.2);
    luigiAvatar.mtxLocal.translateZ(0.001);
    luigiAvatar.mtxLocal.scaleX(1.75);
    luigiAvatar.mtxLocal.scaleY(2);


    graph = viewport.getBranch();
    graph.addChild(luigiAvatar);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);

  }

  const xSpeedDefault: number = 1;
  const xSpeedSprint: number = 3;
  const jumpForce: number = 4.5;
  let ySpeed: number = 0;
  let gravity: number = 9.81;
  

  let animationState: string = "stand";
  let dead: boolean = false;

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    ySpeed -= gravity * deltaTime;
    let yOffset: number = ySpeed * deltaTime;
    luigiAvatar.mtxLocal.translateY(yOffset);

    let pos: ƒ.Vector3 = luigiAvatar.mtxLocal.translation;
    if (pos.y < -1 && !dead) {
      dead = true;
      //cmpAudio.setAudio(audioDeath);
      //cmpAudio.play(true);
      luigiAvatar.setAnimation(luigiDeathAnimation);
      ySpeed = jumpForce * .8;
      viewport.draw();
      return;
    }
    // If dead, stop game and reset page
    if (dead) {
      //cmpAudio.volume = 10;
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
    luigiAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("Left") ? 180 : 0);

    // Jumping
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
      ySpeed = jumpForce;
    }
      //cmpAudio.volume = 6;
      //cmpAudio.setAudio(audioJump);
      //cmpAudio.play(true);
   

    if (ySpeed > 0) {
      animationState = "jump";
      luigiAvatar.setAnimation(luigiJumpAnimation);
      luigiAvatar.showFrame(0);
    }

    if (ySpeed === 0 && animationState.includes("jump")) {
      luigiAvatar.setAnimation(luigiWalkAnimation);
      animationState = "walk";
    }


    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkInput(moveDistance: number, speed: number): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      luigiAvatar.mtxLocal.translateX(moveDistance);
      if (speed > xSpeedDefault && animationState !== "sprintRight") {
        luigiAvatar.setAnimation(luigiRunAnimation);
        animationState = "sprintRight";
        return;
      }
      if (speed <= xSpeedDefault && animationState !== "walkRight") {
        luigiAvatar.setAnimation(luigiWalkAnimation);
        animationState = "walkRight";
        return;
      }
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      luigiAvatar.mtxLocal.translateX(moveDistance);
      if (speed > xSpeedDefault && animationState !== "sprintLeft") {
        luigiAvatar.setAnimation(luigiRunAnimation);
        animationState = "sprintLeft";
        return;
      }
      if (speed <= xSpeedDefault && animationState !== "walkLeft") {
        luigiAvatar.setAnimation(luigiWalkAnimation);
        animationState = "walkLeft";
        return;
      }
      return;
    }

    if (animationState.includes("stand")) {
      luigiAvatar.setAnimation(luigiWalkAnimation);
      luigiAvatar.showFrame(0);
      return;
    }
    animationState = `stand ${animationState.includes("Left") && "Left"}`;
  }

 function checkCollision(): void {
    graph = viewport.getBranch();
    let floors: ƒ.Node = graph.getChildrenByName("Floors")[0];
    let pos: ƒ.Vector3 = luigiAvatar.mtxLocal.translation;
    for (let floor of floors.getChildren()) {
      let posFloor: ƒ.Vector3 = floor.mtxLocal.translation;
      if (Math.abs(pos.x - posFloor.x) < 0.5) {
        if (pos.y < posFloor.y + 0.5) {
          pos.y = posFloor.y + 0.5;
          luigiAvatar.mtxLocal.translation = pos;
          ySpeed = 0;

        }
      }
    }
  }
}

