"use strict";
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
        viewport.camera.mtxPivot.translateZ(10);
        viewport.camera.mtxPivot.rotateY(180);
        luigiNodeInit(_event);
    }
    //Sprite Animations
    let luigiWalkAnimation;
    let luigiRunAnimation;
    let luigiJumpAnimation;
    let luigiDeathAnimation;
    function initAnimations(coat) {
        luigiWalkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        luigiWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 56, 20, 45), 8, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));
        luigiRunAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
        luigiRunAnimation.generateByGrid(ƒ.Rectangle.GET(8, 243, 37, 45), 2, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        luigiJumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
        luigiJumpAnimation.generateByGrid(ƒ.Rectangle.GET(12, 155, 25, 45), 4, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        luigiDeathAnimation = new ƒAid.SpriteSheetAnimation("Die", coat);
        luigiDeathAnimation.generateByGrid(ƒ.Rectangle.GET(43, 400, 20, 45), 1, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
    }
    let audioJump;
    let audioDeath;
    function initializeSounds() {
        audioDeath = new ƒ.Audio("./sounds/super-mario-death-sound-sound-effect.wav");
        audioJump = new ƒ.Audio("./sounds/maro-jump-sound-effect_1.wav");
    }
    //LuigiSprite
    let luigiAvatar;
    let cmpAudio;
    async function luigiNodeInit(_event) {
        let luigiSpriteSheet = new ƒ.TextureImage();
        await luigiSpriteSheet.load("modern_luigi_sprite_sheet_by_mbf1000_d86t2ex.png");
        let coat = new ƒ.CoatTextured(undefined, luigiSpriteSheet);
        initAnimations(coat);
        initializeSounds();
        luigiAvatar = new ƒAid.NodeSprite("luigi_Sprite");
        luigiAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        luigiAvatar.setAnimation(luigiWalkAnimation);
        luigiAvatar.setFrameDirection(1);
        luigiAvatar.framerate = 20;
        luigiAvatar.mtxLocal.translateY(-0.2);
        luigiAvatar.mtxLocal.translateZ(0.001);
        luigiAvatar.mtxLocal.scaleX(1.75);
        luigiAvatar.mtxLocal.scaleY(2);
        graph = viewport.getBranch();
        graph.addChild(luigiAvatar);
        cmpAudio = graph.getComponent(ƒ.ComponentAudio);
        cmpAudio.connect(true);
        cmpAudio.volume = 1;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    const xSpeedDefault = 1;
    const xSpeedSprint = 3;
    const jumpForce = 4.5;
    let ySpeed = 0;
    let gravity = 9.81;
    let animationState = "stand";
    let dead = false;
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        let yOffset = ySpeed * deltaTime;
        luigiAvatar.mtxLocal.translateY(yOffset);
        let pos = luigiAvatar.mtxLocal.translation;
        if (pos.y < -1 && !dead) {
            dead = true;
            cmpAudio.setAudio(audioDeath);
            cmpAudio.play(true);
            luigiAvatar.setAnimation(luigiDeathAnimation);
            ySpeed = jumpForce * .8;
            viewport.draw();
            return;
        }
        // If dead, stop game and reset page
        if (dead) {
            cmpAudio.volume = 10;
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
        luigiAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("Left") ? 180 : 0);
        // Jumping
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
            cmpAudio.setAudio(audioJump);
            cmpAudio.play(true);
            cmpAudio.volume = 6;
            ySpeed = jumpForce;
        }
        if (ySpeed > 0) {
            animationState = "jump";
            luigiAvatar.setAnimation(luigiJumpAnimation);
            luigiAvatar.showFrame(0);
        }
        if (ySpeed < 0) {
            animationState = "jump";
            luigiAvatar.setAnimation(luigiJumpAnimation);
            luigiAvatar.showFrame(2);
        }
        if (ySpeed === 0 && animationState.includes("jump")) {
            luigiAvatar.setAnimation(luigiWalkAnimation);
            animationState = "walk";
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkInput(moveDistance, speed) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            luigiAvatar.mtxLocal.translateX(moveDistance);
            if (speed > xSpeedDefault && animationState !== "sprintRight") {
                luigiAvatar.setAnimation(luigiRunAnimation);
                animationState = "sprintRight";
                return;
            }
            if (speed <= xSpeedDefault && animationState !== "walkRight") {
                luigiAvatar.setAnimation(luigiWalkAnimation);
                animationState = "walkRight";
                return;
            }
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            luigiAvatar.mtxLocal.translateX(moveDistance);
            if (speed > xSpeedDefault && animationState !== "sprintLeft") {
                luigiAvatar.setAnimation(luigiRunAnimation);
                animationState = "sprintLeft";
                return;
            }
            if (speed <= xSpeedDefault && animationState !== "walkLeft") {
                luigiAvatar.setAnimation(luigiWalkAnimation);
                animationState = "walkLeft";
                return;
            }
            return;
        }
        if (animationState.includes("stand")) {
            luigiAvatar.setAnimation(luigiWalkAnimation);
            luigiAvatar.showFrame(0);
            return;
        }
        animationState = `stand ${animationState.includes("Left") && "Left"}`;
    }
    function checkCollision() {
        graph = viewport.getBranch();
        let floors = graph.getChildrenByName("Floors")[0];
        let pos = luigiAvatar.mtxLocal.translation;
        for (let floor of floors.getChildren()) {
            let posFloor = floor.mtxLocal.translation;
            if (Math.abs(pos.x - posFloor.x) < 0.5) {
                if (pos.y < posFloor.y + 0.5) {
                    pos.y = posFloor.y + 0.5;
                    luigiAvatar.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptRotator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptRotator);
        // Properties may be mutated by users in the editor via the automatically created user interface
        speed = 1;
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
                    this.node.addComponent(new ƒ.ComponentTransform());
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.update);
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
        update = (_event) => {
            this.node.mtxLocal.rotateY(this.speed);
        };
    }
    Script.ScriptRotator = ScriptRotator;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map