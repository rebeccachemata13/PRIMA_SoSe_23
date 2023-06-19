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
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
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
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function buildTiles() {
        let yPos = 1;
        let distance = 0;
        let pitch = 0;
        console.log(config.tiles[0].tileNumber);
        for (let i = 0; i < config.tiles.length; i++) {
            switch (config.tiles[i].pitch) {
                case "C":
                    pitch = 0;
                    break;
                case "D":
                    pitch = 2;
                    break;
                case "E":
                    pitch = 4;
                    break;
                case "F":
                    pitch = 6;
                    break;
                case "G":
                    pitch = 8;
                    break;
                case "A":
                    pitch = 10;
                    break;
                case "H":
                    pitch = 12;
                    break;
            }
            switch (config.tiles[i].tileLength) {
                case "1/4":
                    distance = 4;
                    break;
                case "1/2":
                    distance = 8;
                    break;
                case "1/8":
                    distance = 1;
                    break;
                case "4/4":
                    distance = 16;
                    break;
            }
            let position = new ƒ.Vector3(distance + i, yPos, pitch);
            console.log(distance + (2 * i));
            // console.log(config.tiles[5].tileLength);
            let tile = new Script.Tile(config.tiles[i].tileNumber, config.tiles[i].pitch, config.tiles[i].tileLength, position, ƒ.Color.CSS("blue"));
            tile.mtxLocal.scaleX(2.5);
            tile.mtxLocal.scaleY(0.2);
            tile.mtxLocal.scaleZ(1.5);
            viewport.getBranch().addChild(tile);
        }
    }
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
        rigidbodyAvatar.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, avatarCollided);
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
        tileLength;
        constructor(tileNumber, pitch, tileLength, _position, _color) {
            super("Tile");
            this.tileNumber = tileNumber;
            this.pitch = pitch;
            this.tileLength = tileLength;
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