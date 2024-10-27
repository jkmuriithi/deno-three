/**
 * @file Globally accessed objects.
 */

// @deno-types="npm:@types/three@0.169.0"
import { PerspectiveCamera } from "three";

import World from "./world.ts";

export const CAMERA = new PerspectiveCamera(
  75,
  globalThis.innerWidth / globalThis.innerHeight,
  1,
  1000,
);
export const WORLD = new World();
