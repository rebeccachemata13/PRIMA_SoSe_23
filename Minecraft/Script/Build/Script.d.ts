declare namespace Script {
    import ƒ = FudgeCore;
    class Block extends ƒ.Node {
        static meshCube: ƒ.MeshCube;
        constructor(_position: ƒ.Vector3, _material: ƒ.Material);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
