namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  //Environment
  let graph: ƒ.Node;

  //LuigiSprite
  let luigiSpriteNode: ƒAid.NodeSprite;
  let luigi: ƒ.Node;


  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    luigiNodeInit(_event);
  }

  //Sprite Animations
  let luigiWalkAnimation: ƒAid.SpriteSheetAnimation;
  let luigiRunAnimation: ƒAid.SpriteSheetAnimation;
  let luigiJumpAnimation: ƒAid.SpriteSheetAnimation;

  async function initAnimations(coat: ƒ.CoatTextured): Promise<void> {
    luigiWalkAnimation = new ƒAid.SpriteSheetAnimation("luigi_walk", coat);
    luigiWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));

    luigiRunAnimation = new ƒAid.SpriteSheetAnimation("luigi_run", coat);
    luigiRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 245, 37, 45), 2, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

    luigiJumpAnimation = new ƒAid.SpriteSheetAnimation("luigi_run", coat);
    luigiJumpAnimation.generateByGrid(ƒ.Rectangle.GET(320, 112, 37, 45), 1, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
  }

  async function update(_event: Event): Promise<void> {
    luigiControls();
    viewport.draw()    
    ƒ.AudioManager.default.update();
  }

  async function luigiNodeInit(_event: CustomEvent): Promise<void> {
    let graph: ƒ.Node = viewport.getBranch();
    luigi = graph.getChildrenByName("LuigiPosition")[0].getChildrenByName("Luigi")[0];
    luigi.getComponent(ƒ.ComponentMaterial).activate(false);
    luigiSpriteNode = await createluigiSprite();
    luigi.addChild(luigiSpriteNode);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);

  }

  async function createluigiSprite(): Promise<ƒAid.NodeSprite> {

    let luigiSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, luigiSpriteSheet);
    initAnimations(coat);


    luigiSpriteNode = new ƒAid.NodeSprite("luigi_Sprite");
    luigiSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    luigiSpriteNode.setAnimation(luigiWalkAnimation);
    luigiSpriteNode.setFrameDirection(1);

    luigiSpriteNode.mtxLocal.translateY(0.35);
    luigiSpriteNode.mtxLocal.translateX(0);
    luigiSpriteNode.mtxLocal.translateZ(1);
    luigiSpriteNode.mtxLocal.scaleX(1.75);
    luigiSpriteNode.mtxLocal.scaleY(2);

    luigiSpriteNode.framerate = 12;

    return luigiSpriteNode;
  }

  //Speed and Direction Variables
  const xSpeedDefault: number = .9;
  const xSpeedSprint: number = 5;
  const jumpForce: number = 0.08;
  let ySpeed: number = 0.1;
  let gravity: number = 0.1;

  let leftDirection: boolean;
  let prevSprint: boolean = false;

  async function luigiControls(): Promise<void> {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    ySpeed -= gravity * deltaTime;
    luigiSpriteNode.mtxLocal.translateY(ySpeed);
    let yOffset: number = ySpeed * deltaTime;
    luigiSpriteNode.mtxLocal.translateY(yOffset);

    let pos: ƒ.Vector3 = luigiSpriteNode.mtxLocal.translation;
    if (pos.y + ySpeed > 0) {
      luigiSpriteNode.mtxLocal.translateY(ySpeed);
    }
    else {
      ySpeed = 0;
      pos.y = 0;
      luigiSpriteNode.mtxLocal.translation = pos;
    }


    let walkSpeed: number = xSpeedDefault;
    if (leftDirection) {
      walkSpeed = -xSpeedDefault;
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
      walkSpeed = xSpeedSprint;
      if (leftDirection) {
        walkSpeed = -xSpeedSprint;
      }
    }

    const xTranslation: number = walkSpeed * deltaTime;

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      luigiSpriteNode.mtxLocal.translateX(-xTranslation);
      leftDirection = true;
      if (walkSpeed < -1) {
        if (!prevSprint) {
          prevSprint = true;
          luigiSpriteNode.setAnimation(luigiRunAnimation);
        }
      } else {
        prevSprint = false;
      }

    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      luigiSpriteNode.mtxLocal.translateX(xTranslation);
      leftDirection = false;
      if (walkSpeed > 1) {
        if (!prevSprint) {
          prevSprint = true;
          luigiSpriteNode.setAnimation(luigiRunAnimation);
        }
      } else {
        prevSprint = false;
      }
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP])) {


    }
    else {
      luigiSpriteNode.showFrame(0);
      luigiSpriteNode.setAnimation(luigiWalkAnimation);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
       luigiSpriteNode.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
      ySpeed = jumpForce;
      }

    if (ySpeed > 0) {
      luigiSpriteNode.setAnimation(luigiJumpAnimation);
      luigiSpriteNode.showFrame(0);
    } else if (ySpeed < 0) {
      luigiSpriteNode.setAnimation(luigiJumpAnimation);
      luigiSpriteNode.showFrame(1);
    }

    luigiSpriteNode.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);

    checkCollision();

  }

  async function checkCollision(): Promise<void> {
    graph = viewport.getBranch();
    let floors: ƒ.Node = graph.getChildrenByName("Floors")[0];
    let pos: ƒ.Vector3 = luigiSpriteNode.mtxLocal.translation;
    for (let floor of floors.getChildren()) {
      let posFloor: ƒ.Vector3 = floor.mtxLocal.translation;
      if (Math.abs(pos.x - posFloor.x) < 0.5) {
        if (pos.x - posFloor.x < 0.5) {
          pos.y = posFloor.y + 0.5;
          luigiSpriteNode.mtxLocal.translation = pos;
          ySpeed = 0;

        }
      }
    }
  }
}

