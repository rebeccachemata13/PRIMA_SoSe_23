"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Block extends ƒ.Node {
        static meshCube = new ƒ.MeshCube("Block");
        //static matCube: ƒ.Material = new ƒ.Material("Block", ƒ.ShaderFlatTextured, new ƒ.CoatRemissiveTextured);
        constructor(_position, _material) {
            super("Block");
            this.addComponent(new ƒ.ComponentMesh(Block.meshCube));
            let cmpMaterial = new ƒ.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position));
            this.addComponent(cmpTransform);
            let cmpPicker = new ƒ.ComponentPick();
            cmpPicker.pick = ƒ.PICK.RADIUS;
            this.addComponent(cmpPicker);
        }
    }
    Script.Block = Block;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    // let worldGraph: ƒ.Node;
    function start(_event) {
        viewport = _event.detail;
        // worldGraph = viewport.getBranch();
        // let singleblockGraph: ƒ.Graph =<ƒ.Graph>ƒ.Project.resources["Graph|2023-04-23T12:59:57.465Z|45818"];
        // let instance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(singleblockGraph);
        // console.log(instance);
        // instance.mtxLocal.translateX(1);
        // viewport.getBranch().addChild(instance);
        let standardMaterial = ƒ.Project.resources["Material|2023-04-21T12:29:48.810Z|82174"];
        let cubeSize = 3;
        for (let x = 0; x < cubeSize; x++) {
            for (let y = 0; y < cubeSize; y++) {
                for (let z = 0; z < cubeSize; z++) {
                    let instance = new Script.Block(new ƒ.Vector3(x, y, z), standardMaterial);
                    viewport.getBranch().addChild(instance);
                    console.log(instance);
                }
            }
        }
        viewport.canvas.addEventListener("mousedown", pick);
        viewport.getBranch().addEventListener("mousedown", click);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function pick(_event) {
        viewport.dispatchPointerEvent(_event);
    }
    function click(_event) {
        // let node: ƒ.Node = (<ƒ.Node>_event.target);
        // let cmpPick: ƒ.ComponentPick = node.getComponent(ƒ.ComponentPick);
        // console.log("Klicked" + cmpPick);
        let pos = new ƒ.Vector2(_event.clientX, _event.clientY);
        let rayTarget = viewport.getRayFromClient(pos);
        console.log(rayTarget);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map