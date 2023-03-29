namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let shadow: ƒ.Node;
  let shadowSpriteNode: ƒAid.NodeSprite;
  let graph: ƒ.Node;
  let shadowRunAnimation: ƒAid.SpriteSheetAnimation;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    
    viewport= _event.detail;
    shadowNodeInit(_event);
    
  }

  async function initAnimations(coat: ƒ.CoatTextured ): Promise<void>{
    shadowRunAnimation = new ƒAid.SpriteSheetAnimation("Shadow_Run", coat);
    shadowRunAnimation.generateByGrid(ƒ.Rectangle.GET(4, 63, 25, 44), 2, 90, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(30));
  }

  async function update(_event:Event): Promise<void>{
    shadowControls();
    viewport.draw();

  }

  async function shadowNodeInit(_event:CustomEvent):Promise<void>{
    graph = viewport.getBranch();
    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    shadow = graph.getChildrenByName("Avatar")[0].getChildrenByName("Shadow")[0];
    
    shadowSpriteNode = await createShadowSprite();
    
    shadow.addChild(shadowSpriteNode);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    
  }

  async function createShadowSprite(): Promise<ƒAid.NodeSprite>{
    // load spritesheet from folder and add a "coat" to it.
    let shadowSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await shadowSpriteSheet.load("./sprites/shadow_sprite_sheet.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, shadowSpriteSheet);
    initAnimations(coat);

    // add running animation
    shadowSpriteNode = new ƒAid.NodeSprite("Shadow_Sprite");
    shadowSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    shadowSpriteNode.setAnimation(shadowRunAnimation);
    shadowSpriteNode.setFrameDirection(1);
    

    return shadowSpriteNode;

  }

  const xSpeedDefault: number = .9;
  let ySpeed: number = 0.1;
  let gravity: number = 0.1;
  let leftDirection: boolean;
  const jumpForce = 0.08;

  async function shadowControls(): Promise<void>{
    let deltaTime:number = ƒ.Loop.timeFrameGame / 1000;
    ySpeed -= gravity*deltaTime;
    shadowSpriteNode.mtxLocal.translateY(ySpeed);

    let pos: ƒ.Vector3 = shadowSpriteNode.mtxLocal.translation;
    if(pos.y + ySpeed > 0){
      shadowSpriteNode.mtxLocal.translateY(ySpeed);
    }
    else{
      ySpeed = 0;
      pos.y = 0;
      shadowSpriteNode.mtxLocal.translation = pos;
    }

    let walkSpeed: number = xSpeedDefault;
    if (leftDirection) {
      walkSpeed =-xSpeedDefault;
    }

    const xTranslation: number = walkSpeed * deltaTime;

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
       shadowSpriteNode.mtxLocal.translateX(-xTranslation);
       leftDirection = true;
    }else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      shadowSpriteNode.mtxLocal.translateX(xTranslation);
      leftDirection = false;
    }else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP]) && ySpeed === 0){
      shadowSpriteNode.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
      ySpeed = jumpForce;

    }
    shadowSpriteNode.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180:0);
}}