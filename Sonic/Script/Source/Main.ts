namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let shadow: ƒ.Node;
  let graph: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    shadow = graph.getChildrenByName("Avatar")[0].getChildrenByName("Shadow")[0];
    shadow.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4 ));
    
    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
    shadow.mtxLocal.translateX(0.05);
    else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
    shadow.mtxLocal.translateX(-0.05);
    shadow.mtxLocal.rotateY(180);
    }
    viewport.draw();
    
   
    // ƒ.AudioManager.default.update();
  }

}

