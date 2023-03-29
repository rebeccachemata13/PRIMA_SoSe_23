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
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let shadow;
    let shadowSpriteNode;
    let graph;
    let shadowRunAnimation;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        shadowNodeInit(_event);
    }
    async function initAnimations(coat) {
        shadowRunAnimation = new ƒAid.SpriteSheetAnimation("Shadow_Run", coat);
        shadowRunAnimation.generateByGrid(ƒ.Rectangle.GET(4, 63, 25, 44), 2, 90, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(30));
    }
    async function update(_event) {
        shadowControls();
        viewport.draw();
    }
    async function shadowNodeInit(_event) {
        graph = viewport.getBranch();
        let cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        shadow = graph.getChildrenByName("Avatar")[0].getChildrenByName("Shadow")[0];
        shadowSpriteNode = await createShadowSprite();
        shadow.addChild(shadowSpriteNode);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    async function createShadowSprite() {
        // load spritesheet from folder and add a "coat" to it.
        let shadowSpriteSheet = new ƒ.TextureImage();
        await shadowSpriteSheet.load("./sprites/shadow_sprite_sheet.png");
        let coat = new ƒ.CoatTextured(undefined, shadowSpriteSheet);
        initAnimations(coat);
        // add running animation
        shadowSpriteNode = new ƒAid.NodeSprite("Shadow_Sprite");
        shadowSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        shadowSpriteNode.setAnimation(shadowRunAnimation);
        shadowSpriteNode.setFrameDirection(1);
        return shadowSpriteNode;
    }
    const xSpeedDefault = .9;
    let ySpeed = 0.1;
    let gravity = 0.1;
    let leftDirection;
    const jumpForce = 0.08;
    async function shadowControls() {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        shadowSpriteNode.mtxLocal.translateY(ySpeed);
        let pos = shadowSpriteNode.mtxLocal.translation;
        if (pos.y + ySpeed > 0) {
            shadowSpriteNode.mtxLocal.translateY(ySpeed);
        }
        else {
            ySpeed = 0;
            pos.y = 0;
            shadowSpriteNode.mtxLocal.translation = pos;
        }
        let walkSpeed = xSpeedDefault;
        if (leftDirection) {
            walkSpeed = -xSpeedDefault;
        }
        const xTranslation = walkSpeed * deltaTime;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            shadowSpriteNode.mtxLocal.translateX(-xTranslation);
            leftDirection = true;
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            shadowSpriteNode.mtxLocal.translateX(xTranslation);
            leftDirection = false;
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP]) && ySpeed === 0) {
            shadowSpriteNode.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
            ySpeed = jumpForce;
        }
        shadowSpriteNode.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map