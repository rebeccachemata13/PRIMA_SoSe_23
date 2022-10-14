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
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    // Add eventlistener for the loading of the window
    //window.addEventListener("load", onLoad);  
    //window.addEventListener("interactiveViewportStarted", onViewportStart)
    // Define luigiSpriteNode from FUDGE
    let luigiSpriteNode;
    let luigi;
    // load Handler
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        // _event.detail IST der viewport. deshalb können wir das so zuweisen
        viewport = _event.detail;
        let graph = viewport.getBranch();
        luigi = graph.getChildrenByName("LuigiPosition")[0].getChildrenByName("Luigi")[0];
        luigiSpriteNode = await createluigiSprite();
        luigi.addChild(luigiSpriteNode);
        luigi.getComponent(ƒ.ComponentMaterial).activate(false);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // edit framerate here
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function createluigiSprite() {
        // load spritesheet from folder and add a "coat" to it.
        let luigiSpriteSheet = new ƒ.TextureImage();
        await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
        let coat = new ƒ.CoatTextured(undefined, luigiSpriteSheet);
        // add running animation
        let luigiAnimation = new ƒAid.SpriteSheetAnimation("luigi_Run", coat);
        luigiAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 12, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        luigiSpriteNode = new ƒAid.NodeSprite("luigi_Sprite");
        // adds a transform component to the sprite
        luigiSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        luigiSpriteNode.setAnimation(luigiAnimation);
        // play animation forwards
        luigiSpriteNode.setFrameDirection(1);
        // wohl unnötig?
        luigiSpriteNode.mtxLocal.translateY(-1);
        //set framerate here
        luigiSpriteNode.framerate = 10;
        return luigiSpriteNode;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map