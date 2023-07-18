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
    var ƒUi = FudgeUserInterface;
    class Gamestate extends ƒ.Mutable {
        score;
        constructor() {
            super();
            this.score = 0;
            let vui = document.querySelector("div#vui");
            new ƒUi.Controller(this, vui);
            this.addEventListener("mutate" /* ƒ.EVENT.MUTATE */, () => console.log(this));
        }
        reduceMutator(_mutator) {
        }
    }
    Script.Gamestate = Gamestate;
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
    let jumpforce = -3;
    let tileList = new Array();
    let score = -1;
    let gamestate;
    //let rigidbodyTile: ƒ.ComponentRigidbody;
    let isGrounded;
    // let control: ƒ.Control = new ƒ.Control("Proportional", 1, ƒ.CONTROL_TYPE.PROPORTIONAL, 2);
    document.addEventListener("interactiveViewportStarted", start);
    let BOUNCYBALL;
    (function (BOUNCYBALL) {
        BOUNCYBALL["AVATAR_COLLIDES"] = "avatarCollides";
    })(BOUNCYBALL || (BOUNCYBALL = {}));
    async function start(_event) {
        let response = await fetch("config.json");
        config = await response.json();
        gamestate = new Script.Gamestate();
        // console.log(response);
        // console.log(config);
        viewport = _event.detail;
        cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        viewport.canvas.addEventListener("mousemove", handleMousemove);
        setupAvatar();
        buildTiles();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    const audioContext = new AudioContext();
    function generateTone(frequency, duration) {
        // Audio-Knoten erstellen
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain(); // Hüllkurven-Knoten erstellen
        oscillator.type = 'sine'; // Wellenform des Tons (hier: Sinuswelle)
        oscillator.frequency.value = frequency; // Frequenz des Tons
        // Verbindung zum Hüllkurven-Knoten herstellen
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        // Hüllkurve definieren
        const releaseTime = 0.5; // Zeit zum allmählichen Abfaden des Tons (hier: 0.2 Sekunden)
        const currentTime = audioContext.currentTime;
        gainNode.gain.setValueAtTime(1, currentTime); // Startlautstärke
        gainNode.gain.linearRampToValueAtTime(0, currentTime + releaseTime); // Endlautstärke
        // Tonausgabe starten
        oscillator.start();
        // Tonausgabe nach der angegebenen Dauer stoppen
        oscillator.stop(audioContext.currentTime + duration);
    }
    function handleMousemove(_event) {
        rigidbodyAvatar.applyForce(ƒ.Vector3.X(_event.movementX * 0.4));
    }
    function buildTiles() {
        let yPos = 1;
        let distance = 0;
        let pitch = 0;
        let pitches = { "C": 0, "D": 3, "E": 6, "F": 9, "G": 12, "A": 15, "H": 18 };
        let distances = { "1/4": 4, "1/2": 10, "1/8": 5, "4/4": 17 };
        let position = new ƒ.Vector3(pitch, yPos, distance);
        for (let configTile of config.tiles) {
            pitch = pitches[configTile.pitch];
            distance = distances[configTile.length];
            // console.log(config.tiles[5].tileLength);
            position.z -= distance;
            position.x = pitch;
            let tile = new Script.Tile(configTile.pitch, configTile.length, configTile.jumpforce, configTile.frequency, position, ƒ.Color.CSS("blue"));
            tile.mtxLocal.scaleX(1.5);
            tile.mtxLocal.scaleY(0.2);
            tile.mtxLocal.scaleZ(2.5);
            tile.mtxLocal.translateY(-8);
            viewport.getBranch().addChild(tile);
            tileList.push(tile);
        }
    }
    console.log(tileList);
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        cameraMover();
        // control.addEventListener(ƒ.EVENT_CONTROL.OUTPUT, cameraMover);
        rigidbodyAvatar.applyForce(ƒ.Vector3.Z(jumpforce));
        // console.log(jumpforce);
        if (isGrounded) {
            rigidbodyAvatar.addVelocity(ƒ.Vector3.Y(7));
            isGrounded = false;
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function cameraMover() {
        let posCamera = cmpCamera.mtxPivot.translation;
        let posBall = avatar.mtxLocal.translation;
        let cameraMovement = new ƒ.Vector3(posBall.x, posCamera.y, posBall.z + 9);
        cmpCamera.mtxPivot.translation = cameraMovement;
        // console.log(cameraMovement);
    }
    function setupAvatar() {
        avatar = viewport.getBranch().getChildrenByName("Avatar")[0];
        rigidbodyAvatar = avatar.getComponent(ƒ.ComponentRigidbody);
        rigidbodyAvatar.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, avatarCollided);
    }
    function avatarCollided() {
        isGrounded = true;
        let customEvent = new CustomEvent(BOUNCYBALL.AVATAR_COLLIDES, { bubbles: true, detail: avatar.mtxWorld.translation });
        let posBall = avatar.mtxLocal.translation;
        let posTile;
        // console.log(avatar.mtxWorld.translation);
        avatar.dispatchEvent(customEvent);
        score++;
        gamestate.score = score;
        posTile = tileList[score].mtxLocal.translation;
        jumpforce = tileList[score].jumpforce;
        generateTone(tileList[score].frequency, 1);
        console.log(posTile);
        console.log(jumpforce);
        console.log(posBall.z);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        static meshTile = new ƒ.MeshCube("Tile");
        static mtrTile = new ƒ.Material("Tile", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        pitch;
        length;
        jumpforce;
        frequency;
        constructor(pitch, length, jumpforce, frequency, _position, _color) {
            super("Tile");
            this.pitch = pitch;
            this.length = length;
            this.jumpforce = jumpforce;
            this.frequency = frequency;
            this.addComponent(new ƒ.ComponentMesh(Tile.meshTile));
            let cmpMaterial = new ƒ.ComponentMaterial(Tile.mtrTile);
            cmpMaterial.clrPrimary = _color;
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
    Script.Tile = Tile;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map