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
    let luigiSpriteNode;
    let luigi;
    let walkSpeed = 2.0;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        luigi = graph.getChildrenByName("LuigiPosition")[0].getChildrenByName("Luigi")[0];
        luigi.getComponent(ƒ.ComponentMaterial).activate(false);
        luigiSpriteNode = await createluigiSprite();
        luigi.addChild(luigiSpriteNode);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
    }
    async function update(_event) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            luigiSpriteNode.mtxLocal.translateX(walkSpeed * ƒ.Loop.timeFrameGame / 1000);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            luigiSpriteNode.mtxLocal.translateX(-walkSpeed * ƒ.Loop.timeFrameGame / 1000);
            luigiSpriteNode.mtxLocal.rotateY(180);
        }
        ƒ.Loop.timeFrameGame;
        viewport.draw();
        ƒ.AudioManager.default.update();
        console.log("Update");
    }
    async function createluigiSprite() {
        let luigiSpriteSheet = new ƒ.TextureImage();
        await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
        let coat = new ƒ.CoatTextured(undefined, luigiSpriteSheet);
        let luigiAnimation = new ƒAid.SpriteSheetAnimation("luigi_Run", coat);
        luigiAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));
        luigiSpriteNode = new ƒAid.NodeSprite("luigi_Sprite");
        luigiSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        luigiSpriteNode.setAnimation(luigiAnimation);
        luigiSpriteNode.setFrameDirection(1);
        luigiSpriteNode.mtxLocal.translateY(0.35);
        luigiSpriteNode.mtxLocal.translateX(0);
        luigiSpriteNode.mtxLocal.translateZ(1);
        luigiSpriteNode.mtxLocal.scaleX(1.75);
        luigiSpriteNode.mtxLocal.scaleY(2);
        luigiSpriteNode.framerate = 12;
        return luigiSpriteNode;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map