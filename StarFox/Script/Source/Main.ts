namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let engine: EngineScript;
  let vecMouse: ƒ.Vector2 = ƒ.Vector2.ZERO();
  export let cmpTerrain: ƒ.ComponentMesh;
  export let gameState: GameState;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  window.addEventListener("mousemove", hndMouse)

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch("config.json");
    let config: {[key: string]: number} = await response.json();

    gameState = new GameState(config);
    viewport = _event.detail;
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    ƒ.Physics.settings.solverIterations = 300;

    let ship: ƒ.Node = viewport.getBranch().getChildrenByName("SpaceShip")[0];
    engine = ship.getComponent(EngineScript);
    let cmpCamera = ship.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

    cmpTerrain = viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function hndMouse(e: MouseEvent): void {
    vecMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
    vecMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
   }

  function update(_event: Event): void {
    control();
    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function control() {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
      engine.thrust();
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
      engine.backwards();
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      engine.roll(-1);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      engine.roll(1);
    }

    engine.pitch(vecMouse.y);
    engine.yaw(vecMouse.x);
  }
}