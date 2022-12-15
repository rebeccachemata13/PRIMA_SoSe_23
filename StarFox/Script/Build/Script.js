"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class EngineScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(EngineScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        // public message: string = "CustomComponentScript added to ";
        rigidbody;
        power = 1500;
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
                    // ƒ.Debug.log(this.message, this.node);
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.rigidbody.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.hndCollision);
                    this.node.addEventListener("SensorHit", this.hndCollision);
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.update);
                    break;
            }
        };
        hndCollision = (_event) => {
            console.log("Bumm");
        };
        update = (_event) => {
            if (!Script.gameState)
                return;
            Script.gameState.height = this.node.mtxLocal.translation.y;
            Script.gameState.velocity = Math.round(this.rigidbody.getVelocity().magnitude);
            console.log(Script.gameState.fuel);
        };
        yaw(_value) {
            this.rigidbody.applyTorque(new ƒ.Vector3(0, _value * -10, 0));
        }
        pitch(_value) {
            this.rigidbody.applyTorque(ƒ.Vector3.SCALE(this.node.mtxWorld.getX(), _value * 7.5));
        }
        roll(_value) {
            this.rigidbody.applyTorque(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), _value));
        }
        backwards() {
            this.rigidbody.applyForce(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), -this.power));
        }
        thrust() {
            this.rigidbody.applyForce(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), this.power));
        }
    }
    Script.EngineScript = EngineScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        reduceMutator(_mutator) { }
        height = 1;
        velocity = 2;
        fuel = 20;
        controller;
        constructor(_config) {
            super();
            this.fuel = _config.fuel;
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let engine;
    let vecMouse = ƒ.Vector2.ZERO();
    document.addEventListener("interactiveViewportStarted", start);
    window.addEventListener("mousemove", hndMouse);
    async function start(_event) {
        let response = await fetch("config.json");
        let config = await response.json();
        Script.gameState = new Script.GameState(config);
        viewport = _event.detail;
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.Physics.settings.solverIterations = 300;
        let ship = viewport.getBranch().getChildrenByName("SpaceShip")[0];
        engine = ship.getComponent(Script.EngineScript);
        let cmpCamera = ship.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        Script.cmpTerrain = viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function hndMouse(e) {
        vecMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
        vecMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
    }
    function update(_event) {
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
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class SensorScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(SensorScript);
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
                    // this.node.addEventListener(ƒ.EVENT.GRAPH_INSTANTIATED, this.hndEvent)
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.update);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = (_event) => {
            if (!Script.cmpTerrain)
                return;
            let mesh = Script.cmpTerrain.mesh;
            let parent = this.node.getParent();
            let info = mesh.getTerrainInfo(parent.mtxWorld.translation, Script.cmpTerrain.mtxWorld);
            if (info.distance < 0)
                this.node.dispatchEvent(new Event("SensorHit", { bubbles: true }));
        };
    }
    Script.SensorScript = SensorScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map