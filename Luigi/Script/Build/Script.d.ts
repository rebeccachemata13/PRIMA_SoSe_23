declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update(_event: Event): void;
    }
}
declare namespace Script {
}
