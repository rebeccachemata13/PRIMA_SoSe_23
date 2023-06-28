namespace Script {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;

    export class Gamestate extends ƒ.Mutable {
        public score: number;

        constructor() {
            super();
            this.score = 0;

            let vui: HTMLDivElement = document.querySelector("div#vui");
            new ƒUi.Controller(this, vui);
            this.addEventListener(ƒ.EVENT.MUTATE, () => console.log(this));
        }
        protected reduceMutator(_mutator: ƒ.Mutator): void {
        }


    }
}