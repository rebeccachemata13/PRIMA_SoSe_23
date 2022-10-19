namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;

  let luigiSpriteNode: ƒAid.NodeSprite;
  let luigi: ƒ.Node;
  let walkSpeed: number = 2;
  let leftDirection: boolean;
  let leftLastDirection : boolean = false;

  let luigiWalkAnimation: ƒAid.SpriteSheetAnimation;
  let luigiRunAnimation: ƒAid.SpriteSheetAnimation;

  
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();
    luigi = graph.getChildrenByName("LuigiPosition")[0].getChildrenByName("Luigi")[0];
    luigi.getComponent(ƒ.ComponentMaterial).activate(false);
    
    luigiSpriteNode = await createluigiSprite();
    luigi.addChild(luigiSpriteNode);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
  }
  
  async function update(_event: Event): Promise<void> {
    let amount = walkSpeed * ƒ.Loop.timeFrameGame / 1000;
    
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      luigiSpriteNode.mtxLocal.translateX(-amount);
      leftDirection = true;
      luigiSpriteNode.setFrameDirection(1);
      console.log(walkSpeed);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])){
        console.log(luigiSpriteNode.framerate);
        walkSpeed = -5;
        luigiSpriteNode.setAnimation(luigiRunAnimation);
        console.log(walkSpeed);
      } else {
        walkSpeed = -2;
      }
      
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      luigiSpriteNode.mtxLocal.translateX(amount);
      leftDirection = false;
      luigiSpriteNode.setFrameDirection(1);
      console.log(walkSpeed);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])){
        walkSpeed = 5;
        luigiSpriteNode.setAnimation(luigiRunAnimation);
        console.log(walkSpeed);
      } else {
        walkSpeed = 2;
      }
    } else {
      luigiSpriteNode.showFrame(0);
      luigiSpriteNode.setAnimation(luigiWalkAnimation);
    }

    if (leftDirection && !leftLastDirection) {
      luigiSpriteNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
      leftLastDirection = true;
     
    } else if (!leftDirection && leftLastDirection) {
      luigiSpriteNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
      leftLastDirection = false;
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  async function createluigiSprite(): Promise<ƒAid.NodeSprite> {
    
    let luigiSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, luigiSpriteSheet);

    luigiWalkAnimation = new ƒAid.SpriteSheetAnimation("luigi_walk", coat);
    luigiWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));

    luigiRunAnimation = new ƒAid.SpriteSheetAnimation("luigi_run", coat); 
    luigiRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 245, 37, 45), 2, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

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
}