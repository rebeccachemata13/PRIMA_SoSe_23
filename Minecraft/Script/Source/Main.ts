namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let worldGraph: ƒ.Graph;
  let singleblockGraph: ƒ.Graph;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    worldGraph = viewport.getBranch() as ƒ.Graph;
    worldCreator();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  async function worldCreator(): Promise<void> {
    console.log("World generating");
    let cubeIndex: number = 0;
    let cubeMargin: number = 1.01;
    let size: number = 5;
    let cubeArray: ƒ.Node[] = new Array(size * size * size);

    for (let xValue: number = 0; xValue < size; xValue++) {
      for (let zValue: number = 0; zValue < size; zValue++) {
        for (let yValue: number = 0; yValue < size; yValue++) {
          cubeArray[cubeIndex] = cubeGenerator(cubeIndex, new ƒ.Vector3(xValue * cubeMargin, -yValue * cubeMargin, -zValue * cubeMargin));
          cubeIndex++;
        }
      }
    }
}

  function cubeGenerator(i: number, pos: ƒ.Vector3): ƒ.Node {
    let transform: ƒ.Node = new ƒ.Node("CubeTransform" + i);
    transform.addComponent(new ƒ.ComponentTransform());
    transform.mtxLocal.translation = pos;
    return transform;
  }

}