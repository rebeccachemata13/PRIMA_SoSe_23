namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;

  // Add eventlistener for the loading of the window
  //window.addEventListener("load", onLoad);  
  //window.addEventListener("interactiveViewportStarted", onViewportStart)

  // Define luigiSpriteNode from FUDGE
  let luigiSpriteNode: ƒAid.NodeSprite;

  let luigi: ƒ.Node;

  // load Handler

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    // _event.detail IST der viewport. deshalb können wir das so zuweisen
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();
    luigi = graph.getChildrenByName("LuigiPosition")[0].getChildrenByName("Luigi")[0];
    
    luigiSpriteNode = await createluigiSprite();
    luigi.addChild(luigiSpriteNode);
    luigi.getComponent(ƒ.ComponentMaterial).activate(false);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    // edit framerate here
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
  }
  
  async function update(_event: Event): Promise<void> {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    console.log("Update");
    luigiSpriteNode.mtxLocal.translateX(0.05);
  }

  async function createluigiSprite(): Promise<ƒAid.NodeSprite> {

    // load spritesheet from folder and add a "coat" to it.
    let luigiSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, luigiSpriteSheet);
    
    // add running animation
    let luigiAnimation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("luigi_Run", coat);
    luigiAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));
    

    luigiSpriteNode = new ƒAid.NodeSprite("luigi_Sprite");

    // adds a transform component to the sprite
    luigiSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    luigiSpriteNode.setAnimation(luigiAnimation);
    // play animation forwards
    luigiSpriteNode.setFrameDirection(1);

    // wohl unnötig?
    luigiSpriteNode.mtxLocal.translateY(0.35);
    luigiSpriteNode.mtxLocal.translateX(0);
    luigiSpriteNode.mtxLocal.translateZ(1);
    luigiSpriteNode.mtxLocal.scaleX(1.75);
    luigiSpriteNode.mtxLocal.scaleY(2);


    //set framerate here
    luigiSpriteNode.framerate = 12;

    return luigiSpriteNode;
  }
}