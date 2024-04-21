import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  // Box dimensions
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  // Box material
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue
  // Making the box and adding it to scene
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Cylinder Dimensions
  const cylinder_geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  // Cylinder color
  const cylinder_material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
  // Making the Cylinder and setting it's position before adding to scene
  const cylinder = new THREE.Mesh(cylinder_geometry, cylinder_material);
  cylinder.position.set(1.5, 0.5);
  cylinder.scale.set(0.5, 0.5, 0.5);
  scene.add(cylinder);

  // Cone Dimensions
  const cone_geometry = new THREE.ConeGeometry(0.5, 0.8, 32);
  // Making texture loader
  const loader = new THREE.TextureLoader();
  // Loading textures
  const texture = loader.load("./textures/images.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  // Mapping the texture for the cone
  const cone_material = new THREE.MeshPhongMaterial({
    map: texture,
  });
  // Making and adding the cone to the scene
  const cone = new THREE.Mesh(cone_geometry, cone_material);
  cone.position.x = -1.5;
  scene.add(cone);

  // The directional light
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 2, 4);
    scene.add(light);
  }

  // The custom 3d obj model
  let tree;
  {
    // Loading the mtl texture for the 3d model
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./textures/Lowpoly_tree_sample.mtl", (mtl) => {
      mtl.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./objs/Lowpoly_tree_sample.obj", (root) => {
        // Passing the obj outside of the nested block for later use
        tree = root;
        // Setting scale and adding to scene
        root.scale.set(0.1, 0.1, 0.1);
        root.scale.set(0.04, 0.04, 0.04);
        root.position.set(1.5, -1);
        scene.add(root);
      });
    });
  }

  // Rotation function loop that rotates the shapes
  function render(time) {
    time *= 0.001; // convert time to seconds

    cube.rotation.x = time;
    cube.rotation.y = time;

    cylinder.rotation.x = time + 10 * 0.1;
    cylinder.rotation.y = time + 10 * 0.1;

    cone.rotation.y = time + 5 * 0.1;
    cone.rotation.x = time + 5 * 0.1;

    if (tree) {
      tree.rotation.y = time;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
