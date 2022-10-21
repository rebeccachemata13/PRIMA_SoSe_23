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
    //LuigiSprite
    let luigiSpriteNode;
    let luigi;
    //Speed and Direction Variables
    let walkSpeed = 2;
    let leftDirection;
    let gravity = 5;
    //Sprite Animations
    let luigiWalkAnimation;
    let luigiRunAnimation;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        luigi = graph.getChildrenByName("LuigiPosition")[0].getChildrenByName("Luigi")[0];
        luigi.getComponent(ƒ.ComponentMaterial).activate(false);
        luigiSpriteNode = await createluigiSprite();
        luigi.addChild(luigiSpriteNode);
        luigiFall();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
    }
    async function update(_event) {
        luigiControls();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function createluigiSprite() {
        let luigiSpriteSheet = new ƒ.TextureImage();
        await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
        let coat = new ƒ.CoatTextured(undefined, luigiSpriteSheet);
        luigiWalkAnimation = new ƒAid.SpriteSheetAnimation("luigi_walk", coat);
        luigiWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));
        luigiRunAnimation = new ƒAid.SpriteSheetAnimation("luigi_run", coat);
        luigiRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 245, 37, 45), 2, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        luigiSpriteNode = new ƒAid.NodeSprite("luigi_Sprite");
        luigiSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        luigiSpriteNode.setAnimation(luigiWalkAnimation);
        luigiSpriteNode.setFrameDirection(1);
        luigiSpriteNode.mtxLocal.translateY(0.35);
        luigiSpriteNode.mtxLocal.translateX(0);
        luigiSpriteNode.mtxLocal.translateZ(1);
        luigiSpriteNode.mtxLocal.scaleX(1.75);
        luigiSpriteNode.mtxLocal.scaleY(2);
        luigiSpriteNode.framerate = 12;
        return luigiSpriteNode;
    }
    async function luigiControls() {
        let distance = walkSpeed * ƒ.Loop.timeFrameGame / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            luigiSpriteNode.mtxLocal.translateX(-distance);
            leftDirection = true;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
                walkSpeed = -5;
                luigiSpriteNode.setAnimation(luigiRunAnimation);
            }
            else {
                walkSpeed = -2;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            luigiSpriteNode.mtxLocal.translateX(distance);
            leftDirection = false;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
                walkSpeed = 5;
                luigiSpriteNode.setAnimation(luigiRunAnimation);
            }
            else {
                walkSpeed = 2;
            }
        }
        else {
            luigiSpriteNode.showFrame(0);
            luigiSpriteNode.setAnimation(luigiWalkAnimation);
        }
        luigiSpriteNode.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);
    }
    async function luigiFall() {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        let y_Speed = gravity * deltaTime;
        luigiSpriteNode.mtxLocal.translateY(y_Speed);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map