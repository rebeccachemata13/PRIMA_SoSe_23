namespace Script {
  import ƒ = FudgeCore;
  //import ƒUi = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let rigidbodyAvatar: ƒ.ComponentRigidbody;
  let cmpCamera: ƒ.ComponentCamera;
  let config: { tiles: Tile[] };
  let jumpforce: number;
  //let rigidbodyTile: ƒ.ComponentRigidbody;
  let isGrounded: boolean;
  // let control: ƒ.Control = new ƒ.Control("Proportional", 1, ƒ.CONTROL_TYPE.PROPORTIONAL, 2);
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  enum BOUNCYBALL {
    AVATAR_COLLIDES = "avatarCollides"
  }

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    console.log(response);
    console.log(config);

    viewport = _event.detail;
    cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    viewport.canvas.addEventListener("mousemove", handleMousemove);
    
    setupAvatar();
    buildTiles();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function handleMousemove(_event: MouseEvent): void {
    rigidbodyAvatar.applyForce(ƒ.Vector3.X(_event.movementX * 0.4));

  }

  function buildTiles(): void {
    let yPos: number = 1;
    let distance: number = 0;
    let pitch: number = 0;
    let pitches: { [note: string]: number } = { "C": 0, "D": 3, "E": 6, "F": 9, "G": 12, "A": 15, "H": 18 };
    let distances: { [abstand: string]: number } = { "1/4": 4, "1/2": 10, "1/8": 3, "4/4": 17 };
    console.log(config.tiles[0].tileNumber);
    let position: ƒ.Vector3 = new ƒ.Vector3(pitch, yPos, distance);

    for (let configTile of config.tiles) {
      pitch = pitches[configTile.pitch];
      distance = distances[configTile.length];
      jumpforce = configTile.jumpforce;
      // console.log(config.tiles[5].tileLength);
      position.z -= distance;
      position.x = pitch;
      let tile: Tile = new Tile(configTile.tileNumber, configTile.pitch, configTile.length, configTile.jumpforce, position, ƒ.Color.CSS("blue"));
      tile.mtxLocal.scaleX(1.5);
      tile.mtxLocal.scaleY(0.2);
      tile.mtxLocal.scaleZ(2.5);
      tile.mtxLocal.translateY(-8);
      viewport.getBranch().addChild(tile);
    }
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
   
    cameraMover();
    // control.addEventListener(ƒ.EVENT_CONTROL.OUTPUT, cameraMover);
    rigidbodyAvatar.applyForce(ƒ.Vector3.Z(jumpforce));
    console.log(jumpforce);
    if (isGrounded) {
      rigidbodyAvatar.addVelocity(ƒ.Vector3.Y(7));
      isGrounded = false;
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function cameraMover():void {
    console.log("is this working?");
    let posCamera: ƒ.Vector3 = cmpCamera.mtxPivot.translation;
    let posBall: ƒ.Vector3 = avatar.mtxLocal.translation;

    let cameraMovement: ƒ.Vector3 = new ƒ.Vector3 (posBall.x, posCamera.y, posBall.z + 9);
    cmpCamera.mtxPivot.translation = cameraMovement;
    console.log(cameraMovement);
  }

  function setupAvatar(): void {
    avatar = viewport.getBranch().getChildrenByName("Avatar")[0];
    rigidbodyAvatar = avatar.getComponent(ƒ.ComponentRigidbody);
    rigidbodyAvatar.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, avatarCollided);
  }

  function avatarCollided(): void {
    isGrounded = true;
    let customEvent: CustomEvent = new CustomEvent(BOUNCYBALL.AVATAR_COLLIDES, { bubbles: true, detail: avatar.mtxWorld.translation });
    avatar.dispatchEvent(customEvent);
  }


}