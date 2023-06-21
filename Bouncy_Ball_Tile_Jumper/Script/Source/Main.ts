namespace Script {
  import ƒ = FudgeCore;
  //import ƒUi = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let rigidbodyAvatar: ƒ.ComponentRigidbody;
  let config: {tiles: Tile[]}; 
  //let rigidbodyTile: ƒ.ComponentRigidbody;
  let isGrounded: boolean;
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

    setupAvatar();
    buildTiles();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function buildTiles(): void {
    let yPos: number = 1;
    let distance: number = 0;
    let pitch: number = 0;
    console.log(config.tiles[0].tileNumber);

    for (let i: number = 0; i < config.tiles.length; i++) {
    switch(config.tiles[i].pitch){
      case "C":
        pitch = 0;
        break; 
      case "D":
        pitch = 2;
        break; 
      case "E":
        pitch = 4;
        break; 
      case "F":
        pitch = 6;
        break; 
      case "G":
        pitch = 8;
        break;
      case "A":
        pitch = 10;
        break;
      case "H":
        pitch = 12;
        break;
    }

    switch(config.tiles[i].tileLength){
      case "1/4":
        distance = 4;
        break;
      case "1/2":
        distance = 8;
        break;
      case "1/8":
        distance = 1;
        break;
      case "4/4":
        distance = 16;
        break;
      }
      let position: ƒ.Vector3 = new ƒ.Vector3(distance + i, yPos, pitch);
      console.log(distance + (2*i));
      // console.log(config.tiles[5].tileLength);
      let tile: Tile = new Tile (config.tiles[i].tileNumber, config.tiles[i].pitch, config.tiles[i].tileLength, position, ƒ.Color.CSS("blue"));
      tile.mtxLocal.scaleX(2.5);
      tile.mtxLocal.scaleY(0.2);
      tile.mtxLocal.scaleZ(1.5);
      viewport.getBranch().addChild(tile);
    }
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    rigidbodyAvatar.applyForce(ƒ.Vector3.X(1));
    if (isGrounded) {
      rigidbodyAvatar.addVelocity(ƒ.Vector3.Y(8));
      isGrounded = false;
    }
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