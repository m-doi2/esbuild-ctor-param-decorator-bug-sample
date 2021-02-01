import { Container, injectable, inject } from "inversify";

export const Symbols = {
  Ninja: Symbol.for("Ninja"),
  Katana: Symbol.for("Katana"),
  Shuriken: Symbol.for("Shuriken")
};

@injectable()
export class Katana implements Katana {
  public hit() {
    return "cut!";
  }
}

@injectable()
export class Shuriken implements Shuriken {
  public throw() {
    return "hit!";
  }
}

@injectable()
export class Ninja implements Ninja {

  private _katana: Katana;
  private _shuriken: Shuriken;

  public constructor(
    @inject(Symbols.Katana) katana: Katana,
    @inject(Symbols.Shuriken) shuriken: Shuriken
  ) {
    this._katana = katana;
    this._shuriken = shuriken;
  }

  public fight() { return this._katana.hit(); };
  public sneak() { return this._shuriken.throw(); };

}

export const container = new Container();
container.bind<Ninja>(Symbols.Ninja).to(Ninja);
container.bind<Katana>(Symbols.Katana).to(Katana);
container.bind<Shuriken>(Symbols.Shuriken).to(Shuriken);
