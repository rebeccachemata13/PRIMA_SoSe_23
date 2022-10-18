namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;

  let luigiSpriteNode: ƒAid.NodeSprite;
  let luigi: ƒ.Node;
  let walkSpeed: number = 2.0;

  
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
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D,ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      luigiSpriteNode.mtxLocal.translateX(walkSpeed*ƒ.Loop.timeFrameGame/1000);
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      luigiSpriteNode.mtxLocal.translateX(-walkSpeed*ƒ.Loop.timeFrameGame/1000);
      luigiSpriteNode.mtxLocal.rotateY(180);
      luigiSpriteNode.mtxLocal.rotation;
      
    }

    ƒ.Loop.timeFrameGame

     viewport.draw();
     ƒ.AudioManager.default.update();
     console.log("Update");
  }

  async function createluigiSprite(): Promise<ƒAid.NodeSprite> {
    
    let luigiSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, luigiSpriteSheet);

    let luigiAnimation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("luigi_Run", coat);
    luigiAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));
    

    luigiSpriteNode = new ƒAid.NodeSprite("luigi_Sprite");
    luigiSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    luigiSpriteNode.setAnimation(luigiAnimation);
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