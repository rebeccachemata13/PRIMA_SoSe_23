namespace Script {
  import ƒ = FudgeCore;
  //import ƒUi = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let rigidbodyAvatar: ƒ.ComponentRigidbody;
  let config: { tiles: Tile[] };
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
    viewport.canvas.addEventListener("mousemove", handleMousemove);
    setupAvatar();
    buildTiles();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function handleMousemove(_event:MouseEvent):void {
    console.log(_event.movementX);
    rigidbodyAvatar.applyForce(ƒ.Vector3.X(1));
   
    if(_event.movementX < 0){
      rigidbodyAvatar.applyForce(ƒ.Vector3.Z(1));
    } else {
      rigidbodyAvatar.applyForce(ƒ.Vector3.Z(-1));
    }
  }

  function buildTiles(): void {
    let yPos: number = 1;
    let distance: number = 0;
    let pitch: number = 0;
    let pitches: {[note: string]: number} = {"C": 0, "D":2, "E":4, "F":6, "G":8, "A": 10, "H":12};
    console.log(config.tiles[0].tileNumber);
    let position: ƒ.Vector3 = new ƒ.Vector3(distance, yPos, pitch);

    for (let configTile of config.tiles) {
      pitch = pitches[configTile.pitch];
      switch (configTile.length) {
        case "1/4":
          distance = 4;
          break;
        case "1/2":
          distance = 8;
          break;
        case "1/8":
          distance = 3;
          break;
        case "4/4":
          distance = 16;
          break;
      }
      // console.log(config.tiles[5].tileLength);
      position.x += distance;
      position.z = pitch;
      let tile: Tile = new Tile(configTile.tileNumber, configTile.pitch, configTile.length, position, ƒ.Color.CSS("blue"));
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