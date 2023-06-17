namespace Script{
    import ƒ = FudgeCore;

    export class Tile extends ƒ.Node{
        static meshCube: ƒ.MeshCube = new ƒ.MeshCube("Tile");
        constructor(_position: ƒ.Vector3, _material: ƒ.Material){
            super("Tile");
            this.addComponent(new ƒ.ComponentMesh(Tile.meshCube));

            let cmpMaterial: ƒ.ComponentMaterial= new ƒ.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);

            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position));
            this.addComponent(cmpTransform);

            let cpmRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE );
            this.addComponent(cpmRigidbody);
        }
    }
}