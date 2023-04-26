namespace Script{
    import ƒ = FudgeCore;

    export class Block extends ƒ.Node{
        static meshCube: ƒ.MeshCube = new ƒ.MeshCube("Block");
        //static matCube: ƒ.Material = new ƒ.Material("Block", ƒ.ShaderFlatTextured, new ƒ.CoatRemissiveTextured);
        constructor(_position: ƒ.Vector3, _material: ƒ.Material){
            super("Block");
            this.addComponent(new ƒ.ComponentMesh(Block.meshCube));

            let cmpMaterial: ƒ.ComponentMaterial= new ƒ.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);

            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position));
            this.addComponent(cmpTransform);
        

        }
    }
}

//export class Block extends ƒ.Node
//create Mesh
//create Material
//create Transform

//Main.ts