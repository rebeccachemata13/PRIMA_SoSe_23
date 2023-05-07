namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  // let worldGraph: ƒ.Node;
 
 function start(_event: CustomEvent): void {
    viewport = _event.detail;
    // worldGraph = viewport.getBranch();
    // let singleblockGraph: ƒ.Graph =<ƒ.Graph>ƒ.Project.resources["Graph|2023-04-23T12:59:57.465Z|45818"];
    // let instance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(singleblockGraph);
    // console.log(instance);
    // instance.mtxLocal.translateX(1);
    // viewport.getBranch().addChild(instance);
    let standardMaterial: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2023-04-21T12:29:48.810Z|82174"];
    let cubeSize: number = 3;

    for (let x: number = 0; x < cubeSize; x++) {
      for (let y: number = 0; y < cubeSize; y++) {
        for (let z: number = 0; z < cubeSize; z++) {
          let instance: Block = new Block(new ƒ.Vector3(x, y, z), standardMaterial);
          viewport.getBranch().addChild(instance);
          console.log(instance);
        }
      }
    }

    viewport.canvas.addEventListener("mousedown", pick);
    viewport.getBranch().addEventListener("mousedown", <ƒ.EventListenerUnified>click);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }


  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function pick(_event: MouseEvent):void{
    viewport.dispatchPointerEvent(<PointerEvent>_event);
  }

  function click(_event: PointerEvent): void {
     // let node: ƒ.Node = (<ƒ.Node>_event.target);
    // let cmpPick: ƒ.ComponentPick = node.getComponent(ƒ.ComponentPick);
    // console.log("Klicked" + cmpPick);
    let pos: ƒ.Vector2 = new ƒ.Vector2(_event.clientX, _event.clientY);
    let rayTarget: ƒ.Ray = viewport.getRayFromClient(pos);
    console.log(rayTarget);
  }


}