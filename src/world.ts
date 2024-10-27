/**
 * @file Definition of the {@link World} class.
 */

// @deno-types="npm:@types/three@0.169.0"
import { Object3D, Scene } from "three";

/** Lifecycle management container for a 3D environment */
export default class World {
  readonly children: Set<WorldItem> = new Set();
  readonly scene: Scene = new Scene();

  add(...children: WorldItem[]): void {
    children
      .filter((child) => !this.children.has(child))
      .forEach((child) => {
        child.init(this.scene);
        this.children.add(child);
      });
  }

  remove(...children: WorldItem[]): void {
    children
      .filter((child) => this.children.has(child))
      .forEach((child) => {
        child.destroy(this.scene);
        this.children.delete(child);
      });
  }

  /**
   * Updates the world's contents based on `dt`.
   * @param dt number of milliseconds since the last render
   */
  update(dt: number): void {
    this.children.forEach((obj) => obj.update && obj.update(dt));
  }

  destroy(): void {
    this.children.forEach((obj) => obj.destroy(this.scene));
    this.children.clear();
  }
}

/** 3D object which hooks into the lifecycle of a {@link World} */
export interface WorldItem {
  init: (scene: Scene) => void;
  destroy: (scene: Scene) => void;
  update?: (dt: number) => void;
}

/** A {@link WorldItem} wrapper around some Object3D with an update function. */
export class BasicWorldItem<T extends Object3D> implements WorldItem {
  object: T;
  update: WorldItem["update"];

  constructor(object: T, updateFn?: (object: T, dt: number) => void) {
    this.object = object;

    if (updateFn) {
      this.update = (dt) => updateFn(this.object, dt);
    }
  }

  init(scene: Scene): void {
    scene.add(this.object);
  }

  destroy(scene: Scene): void {
    scene.remove(this.object);
  }
}
