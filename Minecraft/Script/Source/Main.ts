namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  //let worldGraph: ƒ.Graph;

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    // let singleblockGraph: ƒ.Graph =<ƒ.Graph>ƒ.Project.resources["Graph|2023-04-23T12:59:57.465Z|45818"];
    // let instance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(singleblockGraph);
    // console.log(instance);
    // instance.mtxLocal.translateX(1);
    // viewport.getBranch().addChild(instance);
    let standardMaterial: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2023-04-21T12:29:48.810Z|82174"];
    let instance: Block = new Block(ƒ.Vector3.X(1), standardMaterial);
    viewport.getBranch().addChild(instance);
    console.log(instance);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

}