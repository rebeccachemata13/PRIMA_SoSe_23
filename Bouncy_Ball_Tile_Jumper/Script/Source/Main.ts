namespace Script {
  import ƒ = FudgeCore;
  //import ƒUi = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;

  //Avatar Variables
  let avatar: ƒ.Node;
  let avatarPos: ƒ.Vector3 = new ƒ.Vector3;
  export let rigidbodyAvatar: ƒ.ComponentRigidbody;
  export let isGrounded: boolean;
  let jumpforce: number = -3;

  //Camera
  let cmpCamera: ƒ.ComponentCamera;
  let posCamera: ƒ.Vector3;

  //Tiles
  let config: { tiles: Tile[] };
  let tileList: Tile[] = new Array();
  let score: number = -1;

  //Gamestate
  let gamestate: Gamestate;

  //Audio
  const audioContext = new AudioContext();

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  enum BOUNCYBALL {
    AVATAR_COLLIDES = "avatarCollides"
  }

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    gamestate = new Gamestate();

    viewport = _event.detail;
    cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    viewport.canvas.addEventListener("mousemove", handleMousemove);
    viewport.canvas.requestPointerLock();

    setupAvatar();
    buildTiles();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function generateTone(frequency: number, duration: number) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);


    const releaseTime = 0.5;
    const currentTime = audioContext.currentTime;

    gainNode.gain.setValueAtTime(1, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + releaseTime);

    oscillator.start();

    oscillator.stop(audioContext.currentTime + duration);
  }

  function handleMousemove(_event: MouseEvent): void {
    rigidbodyAvatar.applyForce(ƒ.Vector3.X(_event.movementX * 0.4));

  }

  function buildTiles(): void {
    let yPos: number = 1;
    let distance: number = 0;
    let pitch: number = 0;
    let pitches: { [note: string]: number } = { "C": 0, "D": 3, "E": 6, "F": 9, "G": 12, "A": 15, "H": 18 };
    let distances: { [abstand: string]: number } = { "1/4": 4, "1/2": 10, "1/8": 5, "4/4": 17 };
    let position: ƒ.Vector3 = new ƒ.Vector3(pitch, yPos, distance);

    for (let configTile of config.tiles) {
      pitch = pitches[configTile.pitch];
      distance = distances[configTile.length];
      position.z -= distance;
      position.x = pitch;
      let tile = new Tile(configTile.pitch, configTile.length, configTile.jumpforce, configTile.frequency, position, ƒ.Color.CSS("beige"));
      tile.mtxLocal.scaleX(1.5);
      tile.mtxLocal.scaleY(0.2);
      tile.mtxLocal.scaleZ(2.5);
      tile.mtxLocal.translateY(-8);
      viewport.getBranch().addChild(tile);
      tileList.push(tile);
    }
  }

  console.log("Tile Liste:", tileList);

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    cameraMover();
    avatarPos = rigidbodyAvatar.node.mtxLocal.translation;
    rigidbodyAvatar.applyForce(ƒ.Vector3.Z(jumpforce));

    //death
    if (avatarPos.y < -4) {
      reset();
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function cameraMover(): void {
    posCamera = cmpCamera.mtxPivot.translation;
    let cameraMovement: ƒ.Vector3 = new ƒ.Vector3(avatarPos.x, posCamera.y, avatarPos.z + 9);
    cmpCamera.mtxPivot.translation = cameraMovement;
  }

  function setupAvatar(): void {
    avatar = viewport.getBranch().getChildrenByName("Avatar")[0];
    rigidbodyAvatar = avatar.getComponent(ƒ.ComponentRigidbody);
    rigidbodyAvatar.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, avatarCollided);
  }

  function avatarCollided(): void {
    isGrounded = true;

    //generate Custom Event vor Collision
    let customEvent: CustomEvent = new CustomEvent(BOUNCYBALL.AVATAR_COLLIDES, { bubbles: true, detail: avatar.mtxWorld.translation });

    avatar.dispatchEvent(customEvent);

    //Update Gamestate
    score++;
    gamestate.score = score;
    gamestate.note = tileList[score].pitch;
    gamestate.frequency = tileList[score].frequency;

    let material: ƒ.ComponentMaterial = tileList[score].getComponent(ƒ.ComponentMaterial);
    let rigidbodyTile: ƒ.ComponentRigidbody = tileList[score].getComponent(ƒ.ComponentRigidbody);
    let animation: ƒ.ComponentAnimator = avatar.getComponent(ƒ.ComponentAnimator);

    //Play and Stop Animation
    animation.playmode = ƒ.ANIMATION_PLAYMODE.LOOP;
    console.log(animation.time);
    setTimeout(() => {
      animation.playmode = ƒ.ANIMATION_PLAYMODE.STOP;
    }, 200);

    //Adjust Jumpforce, Color and Tile TypeBody
    jumpforce = tileList[score].jumpforce;
    material.clrPrimary = ƒ.Color.CSS("purple");
    rigidbodyTile.typeBody = ƒ.BODY_TYPE.DYNAMIC;

    //Generate Tone Audio
    generateTone(tileList[score].frequency, 1);


  }

  function reset(): void {
    avatarPos = rigidbodyAvatar.node.mtxLocal.translation;
    gamestate.score = -1;
    for (let i: number = 0; i < tileList.length; i++) {
      viewport.getBranch().removeChild(tileList[i]);
    }
    avatarPos.z = -4.2;
    avatarPos.x = 0;
    avatarPos.y = 0.6;
    
    buildTiles();
  }
}