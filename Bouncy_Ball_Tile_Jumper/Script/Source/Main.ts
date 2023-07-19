namespace Script {
  import ƒ = FudgeCore;
  //import ƒUi = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  export let rigidbodyAvatar: ƒ.ComponentRigidbody;
  let cmpCamera: ƒ.ComponentCamera;
  let config: { tiles: Tile[] };
  let jumpforce: number = -3;
  let tileList: Tile[] = new Array();
  let score: number = -1;
  let gamestate: Gamestate;
  let avatarPos: ƒ.Vector3 = new ƒ.Vector3;
  export let isGrounded:boolean;


  //let rigidbodyTile: ƒ.ComponentRigidbody;
  // let control: ƒ.Control = new ƒ.Control("Proportional", 1, ƒ.CONTROL_TYPE.PROPORTIONAL, 2);
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  enum BOUNCYBALL {
    AVATAR_COLLIDES = "avatarCollides"
  }

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    gamestate = new Gamestate();
    // console.log(response);
    // console.log(config);



    viewport = _event.detail;
    cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    viewport.canvas.addEventListener("mousemove", handleMousemove);

    setupAvatar();
    buildTiles();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  const audioContext = new AudioContext();

  function generateTone(frequency: number, duration: number) {
    // Audio-Knoten erstellen
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain(); // Hüllkurven-Knoten erstellen
    
    oscillator.type = 'sine'; // Wellenform des Tons (hier: Sinuswelle)
    oscillator.frequency.value = frequency; // Frequenz des Tons
    
    // Verbindung zum Hüllkurven-Knoten herstellen
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Hüllkurve definieren
    const releaseTime = 0.5; // Zeit zum allmählichen Abfaden des Tons (hier: 0.2 Sekunden)
    const currentTime = audioContext.currentTime;
    
    gainNode.gain.setValueAtTime(1, currentTime); // Startlautstärke
    gainNode.gain.linearRampToValueAtTime(0, currentTime + releaseTime); // Endlautstärke
    
    // Tonausgabe starten
    oscillator.start();
    
    // Tonausgabe nach der angegebenen Dauer stoppen
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
      // console.log(config.tiles[5].tileLength);
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

  console.log(tileList);

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used

    cameraMover();
    avatarPos = rigidbodyAvatar.node.mtxLocal.translation;
    // control.addEventListener(ƒ.EVENT_CONTROL.OUTPUT, cameraMover);
    rigidbodyAvatar.applyForce(ƒ.Vector3.Z(jumpforce));
    // console.log(jumpforce);

    if (avatarPos.y < -4){
      alert("Oh no you lost! Reload the page with STRG + F5 and try again :D");
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function cameraMover(): void {
    let posCamera: ƒ.Vector3 = cmpCamera.mtxPivot.translation;
    let posBall: ƒ.Vector3 = avatar.mtxLocal.translation;

    let cameraMovement: ƒ.Vector3 = new ƒ.Vector3(posBall.x, posCamera.y, posBall.z + 9);
    cmpCamera.mtxPivot.translation = cameraMovement;
    // console.log(cameraMovement);
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
    score++;
    gamestate.score = score;
    gamestate.note = tileList[score].pitch;
    gamestate.frequency = tileList[score].frequency;

    let material: ƒ.ComponentMaterial = tileList[score].getComponent(ƒ.ComponentMaterial);
    let rigidbodyTile: ƒ.ComponentRigidbody = tileList[score].getComponent(ƒ.ComponentRigidbody);
    let animation: ƒ.ComponentAnimator = avatar.getComponent(ƒ.ComponentAnimator);

    animation.playmode = ƒ.ANIMATION_PLAYMODE.LOOP;
    console.log(animation.time);
    setTimeout(()=> {
      animation.playmode = ƒ.ANIMATION_PLAYMODE.STOP;
    }, 200);


    jumpforce = tileList[score].jumpforce;
    material.clrPrimary = ƒ.Color.CSS("purple");
    rigidbodyTile.typeBody = ƒ.BODY_TYPE.DYNAMIC;

    generateTone(tileList[score].frequency, 1);
    // console.log(posTile);
    // console.log(jumpforce);
    // console.log(posBall.z);

  }
}