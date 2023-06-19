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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let avatar;
    let rigidbodyAvatar;
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
        setupAvatar();
        buildTiles();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function buildTiles() {
        console.log(config.tiles[0].tileNumber);
        for (let i = 0; i < 2; i++) {
            let tile = new Script.Tile(config.tiles[i].tileNumber, config.tiles[i].pitch, config.tiles[i].tileLength);
        }
    }
    //relPos[0].xPos
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        if (isGrounded) {
            rigidbodyAvatar.addVelocity(ƒ.Vector3.Y(5));
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
        static meshCube = new ƒ.MeshCube("Tile");
        tileNumber;
        pitch;
        tileLength;
        constructor(tileNumber, pitch, tileLength, _position, _material) {
            super("Tile");
            this.tileNumber = tileNumber;
            this.pitch = pitch;
            this.tileLength = tileLength;
            this.addComponent(new ƒ.ComponentMesh(Tile.meshCube));
            let cmpMaterial = new ƒ.ComponentMaterial(_material);
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