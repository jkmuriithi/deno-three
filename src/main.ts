// @deno-types="npm:@types/three@0.169.0"
import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PointLight,
  Vector3,
  WebGLRenderer,
} from "three";

import { CAMERA, WORLD } from "./globals.ts";
import { BasicItem } from "./environment.ts";

function setupWorld() {
  CAMERA.position.set(0, 1, 3);
  CAMERA.lookAt(new Vector3(0, 0, 0));

  const lightOne = new PointLight(0x404040, 250);
  lightOne.position.set(5, 5, 5);
  lightOne.lookAt(new Vector3(0, 0, 0));

  const lightTwo = new PointLight(0x404040, 50);
  lightTwo.position.set(-1, 1, 1);
  lightTwo.lookAt(new Vector3(0, 0, 0));

  WORLD.addObject(lightOne);
  WORLD.addObject(lightTwo);

  const box = new BasicItem(
    new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshPhongMaterial({ color: 0xff0000, shininess: 70 }),
    ),
    (box, dt) => {
      box.rotation.z += 0.001 * dt;
      box.rotation.y += 0.001 * dt;
    },
  );

  WORLD.add(box);
}

let lastTimestamp = performance.now();

function main() {
  const canvas = document.getElementById("root") as HTMLCanvasElement;
  canvas.width = globalThis.innerWidth;
  canvas.height = globalThis.innerHeight;

  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);

  // Handle window resize
  globalThis.addEventListener("resize", () => {
    canvas.width = globalThis.innerWidth;
    canvas.height = globalThis.innerHeight;

    CAMERA.aspect = globalThis.innerWidth / globalThis.innerHeight;
    CAMERA.updateProjectionMatrix();

    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  });

  renderer.setAnimationLoop((currTimestamp: number) => {
    const dt = currTimestamp - lastTimestamp;
    lastTimestamp = currTimestamp;

    WORLD.update(dt);
    renderer.render(WORLD.scene, CAMERA);
  });

  setupWorld();
}

document.addEventListener("DOMContentLoaded", (_event) => {
  main();
});
