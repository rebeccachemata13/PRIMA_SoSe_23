declare namespace Script {
    import ƒ = FudgeCore;
    class BallBouncer extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        scaleY: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Gamestate extends ƒ.Mutable {
        score: number;
        constructor();
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let rigidbodyAvatar: ƒ.ComponentRigidbody;
    let isGrounded: boolean;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        static meshTile: ƒ.MeshCube;
        static mtrTile: ƒ.Material;
        pitch: string;
        length: string;
        jumpforce: number;
        frequency: number;
        constructor(pitch: string, length: string, jumpforce: number, frequency: number, _position: ƒ.Vector3, _color: ƒ.Color);
    }
}
