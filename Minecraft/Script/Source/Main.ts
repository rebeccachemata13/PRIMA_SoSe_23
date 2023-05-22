namespace Script {
  import ƒ = FudgeCore;
  // import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let blocks: ƒ.Node;
  export let grid: Block[][][] = [];
  let steve: ƒ.Node;
  let rigidbodySteve: ƒ.ComponentRigidbody;
  let isGrounded: boolean = false;

  enum MINECRAFT{
    STEVE_COLLIDES = "steveCollides"
  }


  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  // let worldGraph: ƒ.Node;

  function setupSteve(): void {
    steve = viewport.getBranch().getChildrenByName("Steve")[0];
    rigidbodySteve = steve.getComponent(ƒ.ComponentRigidbody);
    rigidbodySteve.effectRotation = ƒ.Vector3.Y();
    ƒ.Physics.settings.sleepingAngularVelocityThreshold = 0.1;
    console.log(steve.getComponent(ƒ.ComponentCamera));
    let cmpCamera: ƒ.ComponentCamera = steve.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    rigidbodySteve.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollided);
  }

  function start(_event: CustomEvent): void {
    viewport = (<CustomEvent>_event).detail;
    // viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    // viewport.canvas.addEventListener("contextmenu", _event => _event.preventDefault());

    setupSteve();
    


    generateWorld(10, 3, 9);

    let pickAlgorithm = [pickByComponent, pickByCamera, pickByRadius, pickByGrid];

    viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
    viewport.getBranch().addEventListener("pointerdown", <ƒ.EventListenerUnified>hitComponent);
    viewport.getBranch().addEventListener(MINECRAFT.STEVE_COLLIDES, (_event:Event) => console.log(_event));

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function steveCollided(_event: ƒ.EventPhysics): void{
    // let vtcCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, steve.mtxWorld.translation);
    // if(Math.abs(vtcCollision.x) < 0.1 && Math.abs(vtcCollision.z) < 0.1 );
    isGrounded = true;
    let customEvent: CustomEvent = new CustomEvent(MINECRAFT.STEVE_COLLIDES, {bubbles: true, detail: steve.mtxWorld.translation});
    steve.dispatchEvent(customEvent);

  }

  function update(_event: Event): void {

    // rigidbodySteve.applyForce(ƒ.Vector3.Z(10));

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
      rigidbodySteve.applyForce(ƒ.Vector3.SCALE(rigidbodySteve.node.mtxWorld.getZ(), 2600));
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
      rigidbodySteve.applyForce(ƒ.Vector3.SCALE(rigidbodySteve.node.mtxWorld.getZ(), -2600));
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      rigidbodySteve.applyTorque(ƒ.Vector3.Y(12));
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      rigidbodySteve.applyTorque(ƒ.Vector3.Y(-12));
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && isGrounded) {
      rigidbodySteve.addVelocity(ƒ.Vector3.Y(7));
      isGrounded = false;
    }
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function generateWorld(_width: number, _height: number, _depth: number): void {
    blocks = new ƒ.Node("Blocks");
    viewport.getBranch().addChild(blocks);
    let standardMaterial: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2023-04-21T12:29:48.810Z|82174"];
    // let vctOffset: ƒ.Vector2 = new ƒ.Vector2(Math.floor(_width / 2), Math.floor(_depth / 2));
    let vctOffset: ƒ.Vector2 = ƒ.Vector2.ZERO();

    for (let y: number = 0; y < _height; y++) {
      grid[y] = [];
      for (let z: number = 0; z < _depth; z++) {
        grid[y][z] = [];
        for (let x: number = 0; x < _width; x++) {
          let vctPostion: ƒ.Vector3 = new ƒ.Vector3(x - vctOffset.x, y + Math.random() * 0.1, z - vctOffset.y);
          // let txtColor: string = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
          let block: Block = new Block(vctPostion, standardMaterial);
          // block.name = vctPostion.toString() + "|" + txtColor;
          blocks.addChild(block);
          grid[y][z][x] = block;
        }
      }
    }
    console.log(grid);
  }
}