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
    let graph;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        let cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        shadowNodeInit(_event);
    }
    //Sprite Animations
    let shadowWalkAnimation;
    let shadowRunAnimation;
    let shadowJumpAnimation;
    let shadowDeathAnimation;
    function initAnimations(coat) {
        shadowWalkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        shadowWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 85, 40, 45), 4, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        shadowRunAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
        shadowRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 140, 40, 45), 5, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        shadowJumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
        shadowJumpAnimation.generateByGrid(ƒ.Rectangle.GET(540, 380, 40, 45), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        shadowDeathAnimation = new ƒAid.SpriteSheetAnimation("Die", coat);
        shadowDeathAnimation.generateByGrid(ƒ.Rectangle.GET(43, 400, 20, 45), 1, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
    }
    let audioJump;
    let audioDeath;
    // function initializeSounds(): void {
    //   audioDeath = new ƒ.Audio("./sounds/super-mario-death-sound-sound-effect.wav");
    //   audioJump = new ƒ.Audio("./sounds/maro-jump-sound-effect_1.wav");
    // }
    //shadowSprite
    let shadowAvatar;
    let cmpAudio;
    async function shadowNodeInit(_event) {
        let shadowSpriteSheet = new ƒ.TextureImage();
        await shadowSpriteSheet.load("./sprites/shadow_sprite_sheet.png");
        let coat = new ƒ.CoatTextured(undefined, shadowSpriteSheet);
        initAnimations(coat);
        // initializeSounds();
        shadowAvatar = new ƒAid.NodeSprite("shadow_Sprite");
        shadowAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        shadowAvatar.setAnimation(shadowWalkAnimation);
        shadowAvatar.setFrameDirection(1);
        shadowAvatar.framerate = 20;
        shadowAvatar.mtxLocal.translateY(-0.2);
        shadowAvatar.mtxLocal.translateZ(0.001);
        shadowAvatar.mtxLocal.scaleX(0.5);
        shadowAvatar.mtxLocal.scaleY(0.5);
        graph = viewport.getBranch();
        graph.addChild(shadowAvatar);
        // cmpAudio = graph.getComponent(ƒ.ComponentAudio);
        // cmpAudio.connect(true);
        // cmpAudio.volume = 1;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    const xSpeedDefault = 2;
    const xSpeedSprint = 3;
    const jumpForce = 5.5;
    let ySpeed = 0;
    let gravity = 9.81;
    let animationState = "stand";
    let dead = false;
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        let yOffset = ySpeed * deltaTime;
        shadowAvatar.mtxLocal.translateY(yOffset);
        let pos = shadowAvatar.mtxLocal.translation;
        if (pos.y < -1 && !dead) {
            dead = true;
            // cmpAudio.setAudio(audioDeath);
            // cmpAudio.play(true);
            shadowAvatar.setAnimation(shadowDeathAnimation);
            ySpeed = jumpForce * .8;
            viewport.draw();
            return;
        }
        // If dead, stop game and reset page
        if (dead) {
            // cmpAudio.volume = 10;
            pos.y = -2;
            window.location.reload();
            viewport.draw();
            return;
        }
        checkCollision();
        let speed = xSpeedDefault;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
            speed = xSpeedSprint;
        }
        // Calculate travel distance
        const moveDistance = speed * ƒ.Loop.timeFrameGame / 1000;
        // Check for key presses and move player accordingly
        checkInput(moveDistance, speed);
        // Rotate based on direction
        shadowAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("Left") ? 180 : 0);
        // Jumping
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
            // cmpAudio.setAudio(audioJump);
            // cmpAudio.play(true);
            // cmpAudio.volume = 6;
            ySpeed = jumpForce;
        }
        if (ySpeed > 0) {
            animationState = "jump";
            shadowAvatar.setAnimation(shadowJumpAnimation);
            shadowAvatar.showFrame(0);
        }
        if (ySpeed < 0) {
            animationState = "jump";
            shadowAvatar.setAnimation(shadowJumpAnimation);
            shadowAvatar.showFrame(2);
        }
        if (ySpeed === 0 && animationState.includes("jump")) {
            shadowAvatar.setAnimation(shadowWalkAnimation);
            animationState = "walk";
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkInput(moveDistance, speed) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            shadowAvatar.mtxLocal.translateX(moveDistance);
            if (speed > xSpeedDefault && animationState !== "sprintRight") {
                shadowAvatar.setAnimation(shadowRunAnimation);
                animationState = "sprintRight";
                return;
            }
            if (speed <= xSpeedDefault && animationState !== "walkRight") {
                shadowAvatar.setAnimation(shadowWalkAnimation);
                animationState = "walkRight";
                return;
            }
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            shadowAvatar.mtxLocal.translateX(moveDistance);
            if (speed > xSpeedDefault && animationState !== "sprintLeft") {
                shadowAvatar.setAnimation(shadowRunAnimation);
                animationState = "sprintLeft";
                return;
            }
            if (speed <= xSpeedDefault && animationState !== "walkLeft") {
                shadowAvatar.setAnimation(shadowWalkAnimation);
                animationState = "walkLeft";
                return;
            }
            return;
        }
        if (animationState.includes("stand")) {
            shadowAvatar.setAnimation(shadowWalkAnimation);
            shadowAvatar.showFrame(0);
            return;
        }
        animationState = `stand ${animationState.includes("Left") && "Left"}`;
    }
    function checkCollision() {
        graph = viewport.getBranch();
        let floors = graph.getChildrenByName("Floors")[0];
        let pos = shadowAvatar.mtxLocal.translation;
        for (let floor of floors.getChildren()) {
            let posFloor = floor.mtxLocal.translation;
            if (Math.abs(pos.x - posFloor.x) < 0.5) {
                if (pos.y < posFloor.y + 0.01) {
                    pos.y = posFloor.y + 0.01;
                    shadowAvatar.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map