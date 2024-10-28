/**
 * @file Definition of the {@link Environment} class.
 */

// @deno-types="npm:@types/three@0.169.0"
import { Object3D, Scene } from "three";

/** Lifecycle management container for a {@link Scene}. */
export default class Environment {
  readonly children: Set<Item> = new Set();
  readonly scene: Scene = new Scene();

  add(...children: Item[]): void {
    children
      .filter((child) => !this.children.has(child))
      .forEach((child) => {
        child.init(this.scene);
        this.children.add(child);
      });
  }

  /**
   * Creates a {@link BasicItem} from `object` and adds it to this
   * environment.
   * @param object Object3D to add
   * @returns the newly created {@link BasicItem}
   */
  addObject<T extends Object3D>(object: T): BasicItem<T> {
    const item = new BasicItem(object);
    this.add(item);
    return item;
  }

  remove(...children: Item[]): void {
    children
      .filter((child) => this.children.has(child))
      .forEach((child) => {
        child.destroy(this.scene);
        this.children.delete(child);
      });
  }

  /**
   * Updates the environment's contents based on `dt`.
   * @param dt number of milliseconds since the last render
   */
  update(dt: number): void {
    this.children.forEach((obj) => obj.update && obj.update(dt));
  }

  /**
   * Destroy all contained objects and remove them from the environment.
   */
  clear(): void {
    this.children.forEach((obj) => obj.destroy(this.scene));
    this.children.clear();
    this.scene.clear();
  }
}

/** 3D object which hooks into the lifecycle of an {@link Environment}. */
export interface Item {
  init: (scene: Scene) => void;
  destroy: (scene: Scene) => void;
  update: (dt: number) => void;
}

/** An {@link Item} wrapper around some Object3D with an update function. */
export class BasicItem<T extends Object3D> implements Item {
  object: T;
  updateFn?: (object: T, dt: number) => void;

  constructor(object: T, updateFn?: (object: T, dt: number) => void) {
    this.object = object;
    this.updateFn = updateFn;
  }

  init(scene: Scene): void {
    scene.add(this.object);
  }

  destroy(scene: Scene): void {
    scene.remove(this.object);
  }

  update(dt: number): void {
    this.updateFn && this.updateFn(this.object, dt);
  }
}
