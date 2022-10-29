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
    document.addEventListener("interactiveViewportStarted", start);
    //Environment
    let graph;
    //LuigiSprite
    let luigiSpriteNode;
    let luigi;
    async function start(_event) {
        viewport = _event.detail;
        luigiNodeInit(_event);
    }
    //Sprite Animations
    let luigiWalkAnimation;
    let luigiRunAnimation;
    let luigiJumpAnimation;
    async function initAnimations(coat) {
        luigiWalkAnimation = new ƒAid.SpriteSheetAnimation("luigi_walk", coat);
        luigiWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 60, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));
        luigiRunAnimation = new ƒAid.SpriteSheetAnimation("luigi_run", coat);
        luigiRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 245, 37, 45), 2, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        luigiJumpAnimation = new ƒAid.SpriteSheetAnimation("luigi_run", coat);
        luigiJumpAnimation.generateByGrid(ƒ.Rectangle.GET(320, 112, 37, 45), 1, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
    }
    async function update(_event) {
        luigiControls();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function luigiNodeInit(_event) {
        let graph = viewport.getBranch();
        luigi = graph.getChildrenByName("LuigiPosition")[0].getChildrenByName("Luigi")[0];
        luigi.getComponent(ƒ.ComponentMaterial).activate(false);
        luigiSpriteNode = await createluigiSprite();
        luigi.addChild(luigiSpriteNode);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    async function createluigiSprite() {
        let luigiSpriteSheet = new ƒ.TextureImage();
        await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
        let coat = new ƒ.CoatTextured(undefined, luigiSpriteSheet);
        initAnimations(coat);
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
    //Speed and Direction Variables
    const xSpeedDefault = .9;
    const xSpeedSprint = 5;
    const jumpForce = 0.08;
    let ySpeed = 0.1;
    let gravity = 0.1;
    let leftDirection;
    let prevSprint = false;
    async function luigiControls() {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        luigiSpriteNode.mtxLocal.translateY(ySpeed);
        let yOffset = ySpeed * deltaTime;
        luigiSpriteNode.mtxLocal.translateY(yOffset);
        let pos = luigiSpriteNode.mtxLocal.translation;
        if (pos.y + ySpeed > 0) {
            luigiSpriteNode.mtxLocal.translateY(ySpeed);
        }
        else {
            ySpeed = 0;
            pos.y = 0;
            luigiSpriteNode.mtxLocal.translation = pos;
        }
        let walkSpeed = xSpeedDefault;
        if (leftDirection) {
            walkSpeed = -xSpeedDefault;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
            walkSpeed = xSpeedSprint;
            if (leftDirection) {
                walkSpeed = -xSpeedSprint;
            }
        }
        const xTranslation = walkSpeed * deltaTime;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            luigiSpriteNode.mtxLocal.translateX(-xTranslation);
            leftDirection = true;
            if (walkSpeed < -1) {
                if (!prevSprint) {
                    prevSprint = true;
                    luigiSpriteNode.setAnimation(luigiRunAnimation);
                }
            }
            else {
                prevSprint = false;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            luigiSpriteNode.mtxLocal.translateX(xTranslation);
            leftDirection = false;
            if (walkSpeed > 1) {
                if (!prevSprint) {
                    prevSprint = true;
                    luigiSpriteNode.setAnimation(luigiRunAnimation);
                }
            }
            else {
                prevSprint = false;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP])) {
        }
        else {
            luigiSpriteNode.showFrame(0);
            luigiSpriteNode.setAnimation(luigiWalkAnimation);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
            luigiSpriteNode.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
            ySpeed = jumpForce;
        }
        if (ySpeed > 0) {
            luigiSpriteNode.setAnimation(luigiJumpAnimation);
            luigiSpriteNode.showFrame(0);
        }
        else if (ySpeed < 0) {
            luigiSpriteNode.setAnimation(luigiJumpAnimation);
            luigiSpriteNode.showFrame(1);
        }
        luigiSpriteNode.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);
        checkCollision();
    }
    async function checkCollision() {
        graph = viewport.getBranch();
        let floors = graph.getChildrenByName("Floors")[0];
        let pos = luigiSpriteNode.mtxLocal.translation;
        for (let floor of floors.getChildren()) {
            let posFloor = floor.mtxLocal.translation;
            if (Math.abs(pos.x - posFloor.x) < 0.5) {
                if (pos.x - posFloor.x < 0.5) {
                    pos.y = posFloor.y + 0.5;
                    luigiSpriteNode.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map