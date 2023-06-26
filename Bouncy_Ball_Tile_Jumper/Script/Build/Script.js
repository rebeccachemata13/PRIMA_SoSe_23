"use strict";
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
    //import ƒUi = FudgeUserInterface;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let avatar;
    let rigidbodyAvatar;
    let cmpCamera;
    let config;
    //let rigidbodyTile: ƒ.ComponentRigidbody;
    let isGrounded;
    document.addEventListener("interactiveViewportStarted", start);
    let BOUNCYBALL;
    (function (BOUNCYBALL) {
        BOUNCYBALL["AVATAR_COLLIDES"] = "avatarCollides";
    })(BOUNCYBALL || (BOUNCYBALL = {}));
    async function start(_event) {
        let response = await fetch("config.json");
        config = await response.json();
        console.log(response);
        console.log(config);
        viewport = _event.detail;
        cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        viewport.canvas.addEventListener("mousemove", handleMousemove);
        setupAvatar();
        buildTiles();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function handleMousemove(_event) {
        rigidbodyAvatar.applyForce(ƒ.Vector3.X(_event.movementX * 0.1));
    }
    function buildTiles() {
        let yPos = 1;
        let distance = 0;
        let pitch = 0;
        let pitches = { "C": 0, "D": 2, "E": 4, "F": 6, "G": 8, "A": 10, "H": 12 };
        let distances = { "1/4": 4, "1/2": 8, "1/8": 3, "4/4": 16 };
        console.log(config.tiles[0].tileNumber);
        let position = new ƒ.Vector3(pitch, yPos, distance);
        for (let configTile of config.tiles) {
            pitch = pitches[configTile.pitch];
            distance = distances[configTile.length];
            // console.log(config.tiles[5].tileLength);
            position.z -= distance;
            position.x = pitch;
            let tile = new Script.Tile(configTile.tileNumber, configTile.pitch, configTile.length, position, ƒ.Color.CSS("blue"));
            tile.mtxLocal.scaleX(1.5);
            tile.mtxLocal.scaleY(0.2);
            tile.mtxLocal.scaleZ(2.5);
            tile.mtxLocal.translateY(-8);
            viewport.getBranch().addChild(tile);
        }
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        rigidbodyAvatar.applyForce(ƒ.Vector3.X(0.3));
        if (isGrounded) {
            rigidbodyAvatar.addVelocity(ƒ.Vector3.Y(1));
        }
        else {
            isGrounded = false;
        }
    }
    function setupAvatar() {
        avatar = viewport.getBranch().getChildrenByName("Avatar")[0];
        rigidbodyAvatar = avatar.getComponent(ƒ.ComponentRigidbody);
        rigidbodyAvatar.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, avatarCollided);
    }
    function avatarCollided() {
        isGrounded = true;
        let customEvent = new CustomEvent(BOUNCYBALL.AVATAR_COLLIDES, { bubbles: true, detail: avatar.mtxWorld.translation });
        avatar.dispatchEvent(customEvent);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        static meshTile = new ƒ.MeshCube("Tile");
        static mtrTile = new ƒ.Material("Tile", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        tileNumber;
        pitch;
        length;
        constructor(tileNumber, pitch, length, _position, _color) {
            super("Tile");
            this.tileNumber = tileNumber;
            this.pitch = pitch;
            this.length = length;
            this.addComponent(new ƒ.ComponentMesh(Tile.meshTile));
            let cmpMaterial = new ƒ.ComponentMaterial(Tile.mtrTile);
            cmpMaterial.clrPrimary = _color;
            this.addComponent(cmpMaterial);
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position));
            this.addComponent(cmpTransform);
            let cpmRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(cpmRigidbody);
        }
    }
    Script.Tile = Tile;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map