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
            let cpmRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(cpmRigidbody);
        }
    }
    Script.Block = Block;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CreeperMaschine extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CreeperMaschine);
        // Properties may be mutated by users in the editor via the automatically created user interface
        // public message: string = "This is the CreeperMaschine Skript ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
            this.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
                case "renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */:
                    console.log("Rendering now..");
                    break;
            }
        };
        update = (_event) => {
            // let rigidbodySteve: ƒ.ComponentRigidbody = steve.getComponent(ƒ.ComponentRigidbody);
            // let rigidbodyCreeper: ƒ.ComponentRigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            // let posSteve: ƒ.Vector3 = rigidbodySteve.node.mtxWorld.translation;
            // let posCreeper: ƒ.Vector3 = rigidbodySteve.node.mtxWorld.translation;
            // rigidbodyCreeper.applyForce(ƒ.Vector3.X(1));
            // rigidbodyCreeper.applyForce(ƒ.Vector3.Z(3));
            // let movementVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(posSteve, posCreeper);
            // movementVector.normalize(100);
            // rigidbodyCreeper.applyForce(movementVector);
        };
    }
    Script.CreeperMaschine = CreeperMaschine;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    // import ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    Script.grid = [];
    let rigidbodySteve;
    let isGrounded = false;
    let MINECRAFT;
    (function (MINECRAFT) {
        MINECRAFT["STEVE_COLLIDES"] = "steveCollides";
    })(MINECRAFT || (MINECRAFT = {}));
    document.addEventListener("interactiveViewportStarted", start);
    // let worldGraph: ƒ.Node;
    function setupSteve() {
        Script.steve = Script.viewport.getBranch().getChildrenByName("Steve")[0];
        rigidbodySteve = Script.steve.getComponent(ƒ.ComponentRigidbody);
        rigidbodySteve.effectRotation = ƒ.Vector3.Y();
        ƒ.Physics.settings.sleepingAngularVelocityThreshold = 0.1;
        console.log(Script.steve.getComponent(ƒ.ComponentCamera));
        let cmpCamera = Script.steve.getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        rigidbodySteve.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, steveCollided);
    }
    function start(_event) {
        Script.viewport = _event.detail;
        // viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        // viewport.canvas.addEventListener("contextmenu", _event => _event.preventDefault());
        setupSteve();
        generateWorld(10, 3, 9);
        let pickAlgorithm = [Script.pickByComponent, Script.pickByCamera, Script.pickByRadius, Script.pickByGrid];
        Script.viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
        Script.viewport.getBranch().addEventListener("pointerdown", Script.hitComponent);
        Script.viewport.getBranch().addEventListener(MINECRAFT.STEVE_COLLIDES, (_event) => console.log(_event));
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function steveCollided(_event) {
        // let vtcCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, steve.mtxWorld.translation);
        // if(Math.abs(vtcCollision.x) < 0.1 && Math.abs(vtcCollision.z) < 0.1 );
        isGrounded = true;
        let customEvent = new CustomEvent(MINECRAFT.STEVE_COLLIDES, { bubbles: true, detail: Script.steve.mtxWorld.translation });
        Script.steve.dispatchEvent(customEvent);
    }
    function update(_event) {
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
        ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function generateWorld(_width, _height, _depth) {
        Script.blocks = new ƒ.Node("Blocks");
        Script.viewport.getBranch().addChild(Script.blocks);
        let standardMaterial = ƒ.Project.resources["Material|2023-04-21T12:29:48.810Z|82174"];
        // let vctOffset: ƒ.Vector2 = new ƒ.Vector2(Math.floor(_width / 2), Math.floor(_depth / 2));
        let vctOffset = ƒ.Vector2.ZERO();
        for (let y = 0; y < _height; y++) {
            Script.grid[y] = [];
            for (let z = 0; z < _depth; z++) {
                Script.grid[y][z] = [];
                for (let x = 0; x < _width; x++) {
                    let vctPostion = new ƒ.Vector3(x - vctOffset.x, y + Math.random() * 0.1, z - vctOffset.y);
                    // let txtColor: string = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
                    let block = new Script.Block(vctPostion, standardMaterial);
                    // block.name = vctPostion.toString() + "|" + txtColor;
                    Script.blocks.addChild(block);
                    Script.grid[y][z][x] = block;
                }
            }
        }
        console.log(Script.grid);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function pickByComponent(_event) {
        console.log("pickByComponent");
        Reflect.set(_event, "closestDistance", Infinity);
        Reflect.set(_event, "closestBlock", null);
        Script.viewport.dispatchPointerEvent(_event);
        hitBlock(Reflect.get(_event, "closestBlock"));
    }
    Script.pickByComponent = pickByComponent;
    function hitComponent(_event) {
        let block = _event.target;
        let closestDistance = Reflect.get(_event, "closestDistance");
        let pick = Reflect.get(_event, "pick");
        if (pick.zBuffer < closestDistance) {
            Reflect.set(_event, "closestDistance", pick.zBuffer);
            Reflect.set(_event, "closestBlock", block);
        }
    }
    Script.hitComponent = hitComponent;
    function pickByCamera(_event) {
        console.log("pickCamera");
        let picks = ƒ.Picker.pickViewport(Script.viewport, new ƒ.Vector2(_event.clientX, _event.clientY));
        picks.sort((_a, _b) => _a.zBuffer < _b.zBuffer ? -1 : 1);
        hitBlock(picks[0]?.node);
        console.log(picks[0]);
    }
    Script.pickByCamera = pickByCamera;
    function pickByRadius(_event) {
        console.log("pickByRay");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let shortest;
        let found = null;
        let compare = Math.pow(0.7, 2);
        for (let block of Script.blocks.getChildren()) {
            if (compare < ray.getDistance(block.mtxWorld.translation).magnitudeSquared)
                continue;
            let distance = ƒ.Vector3.DIFFERENCE(block.mtxWorld.translation, ray.origin).magnitudeSquared;
            if (shortest == undefined || distance < shortest) {
                shortest = distance;
                found = block;
            }
        }
        hitBlock(found);
    }
    Script.pickByRadius = pickByRadius;
    function pickByGrid(_event) {
        console.log("pickByGrid");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let posCheck = ray.origin.clone;
        let vctStep = ray.direction.clone;
        // find largest component value
        let largest = vctStep.get().reduce((_p, _c) => Math.max(_p, Math.abs(_c)));
        // normalize to 1 in that direction
        vctStep.scale(1 / largest);
        for (let i = 0; i < 100; i++) {
            posCheck.add(vctStep);
            let posGrid = posCheck.map(_value => Math.round(_value));
            console.log(posGrid.toString(), posCheck.toString());
            try {
                let block = Script.grid[posGrid.y][posGrid.z][posGrid.x];
                if (block) {
                    hitBlock(block);
                    return;
                }
            }
            catch (_e) { }
        }
    }
    Script.pickByGrid = pickByGrid;
    function hitBlock(_block) {
        if (!_block)
            return;
        console.log(_block.name);
        _block.getParent().removeChild(_block);
        Script.viewport.draw();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map