namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let rigidbodyAvatar: ƒ.ComponentRigidbody;
  //let rigidbodyTile: ƒ.ComponentRigidbody;
  let isGrounded: boolean;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  enum BOUNCYBALL{
    AVATAR_COLLIDES = "avatarCollides"
  }

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch("config.json");
    let config: Object = response.json;
    console.log(response);
    console.log(config);
    
    viewport = _event.detail;

    setupAvatar();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    if(isGrounded){
      rigidbodyAvatar.addVelocity(ƒ.Vector3.Y(5));
      isGrounded = false;
    }
  }

  function setupAvatar(): void {
    avatar = viewport.getBranch().getChildrenByName("Avatar")[0];
    rigidbodyAvatar = avatar.getComponent(ƒ.ComponentRigidbody);
    rigidbodyAvatar.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, avatarCollided);
  }

  function avatarCollided(): void{
    isGrounded = true;
    let customEvent: CustomEvent = new CustomEvent(BOUNCYBALL.AVATAR_COLLIDES, {bubbles: true, detail: avatar.mtxWorld.translation});
    avatar.dispatchEvent(customEvent);
  }


}