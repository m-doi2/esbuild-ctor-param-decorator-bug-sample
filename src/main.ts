import 'reflect-metadata';
import { Symbols, container, Ninja } from './container';

const ninja = container.get<Ninja>(Symbols.Ninja);
console.log(ninja.fight());
