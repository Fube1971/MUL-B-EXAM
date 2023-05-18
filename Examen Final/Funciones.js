
/**
 * 
 * @param {Numero nde lados o numero de caras} nlados 
 * @param {Dimension de poligono} dim 
 * @returns vertices de un poligono
 */


function poligono(nlados, dim) {
  const vertices = [];
  const ang = 2*Math.PI/nlados;
  radio = dim/2/Math.sin(ang/2);
  for (i=0; i<=nlados; i++) {
      const x = radio*Math.cos(i*ang);
      const y = radio*Math.sin(i*ang);
      vertices.push([x, y]);
  }
  return vertices;
}

/**
 * 
 * @param {Altura del poligono} height 
 * @param {Numero de caras o de lados} numFaces 
 * @param {Dimension apotema inferior} lowerApothem 
 * @param {Dimension del apotema superior} topApothem 
 * @param {posisicon en x*2} x2 
 * @param {posicion en z*2} z2 
 * @returns objeto mesh de un tronco piramidal, en la posicion que yo quiera en los ejes x y y
 */

function crearGeometry(height, numFaces, lowerApothem, topApothem, x2, z2) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  // Calcular los angulos
  const angle = (2 * Math.PI) / numFaces;
  const topVertices = numFaces;

  // Generar vertices de la cara inferior
  const bottomVertices = poligono(numFaces, lowerApothem);

  // Generar vertices de la cara superior
  const topVerticesArray = poligono(topVertices, topApothem);

  // Generar caras
  for (let i = 0; i < numFaces; i++) {
    const bottomVertex1 = bottomVertices[i];
    const bottomVertex2 = bottomVertices[(i + 1) % numFaces];
    const topVertex1 = topVerticesArray[i];
    const topVertex2 = topVerticesArray[(i + 1) % numFaces];

    // Cara inferior
    positions.push(bottomVertex1[0] + x2, 0, bottomVertex1[1] + z2);
    positions.push(bottomVertex2[0] + x2, 0, bottomVertex2[1] + z2);
    positions.push(x2, 0, z2);

    // Cara superior
    positions.push(topVertex1[0] + x2, height, topVertex1[1] + z2);
    positions.push(topVertex2[0] + x2, height, topVertex2[1] + z2);
    positions.push(x2, height, z2);

    // Lados de las caras
    positions.push(bottomVertex1[0] + x2, 0, bottomVertex1[1] + z2);
    positions.push(topVertex1[0] + x2, height, topVertex1[1] + z2);
    positions.push(topVertex2[0] + x2, height, topVertex2[1] + z2);

    positions.push(bottomVertex1[0] + x2, 0, bottomVertex1[1] + z2);
    positions.push(topVertex2[0] + x2, height, topVertex2[1] + z2);
    positions.push(bottomVertex2[0] + x2, 0, bottomVertex2[1] + z2);
  }

  // Setear posiciones del atributo
  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  return geometry;
}

/**
 * 
 * @param { Geometria buffer geomtry} geometry 
 * @returns  Mesh ya adiciondo a la escena
 */

function CrearMesh(geometry) {
  // Generar un color aleatorio
  const randomColor = Math.random() * 0xffffff;

  // Crear un material con un color aleatorio
  const material = new THREE.MeshBasicMaterial({ color: randomColor, side: THREE.DoubleSide });

  // Crear mesh con el material y la geometria
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
/**
 * 
 * @param {Altura del poligono} height 
 * @param {Numero de caras o de lados} numFaces 
 * @param {Dimension apotema inferior} lowerApothem 
 * @param {Dimension del apotema superior} topApothem 
 * @param {Spacio netre las figuras} spacing 
 * @returns retorna grupo de objetos mesh, en posicion deseada
 */

function CreaGrupodeMesh(height, numFaces, lowerApothem, topApothem, spacing) {
  const group = new THREE.Group();

  // Calcular total del ancho de cada geometria
  const geometryWidth = lowerApothem * 2;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 1; col++) {
      const x = col * (geometryWidth + spacing);
      const z = row * (height + spacing);

      // Creargeometria usando 
      const geometry = crearGeometry(height, numFaces, lowerApothem, topApothem, x, z);

      // Create mesh using createMesh function
      const mesh = CrearMesh(geometry);

      // Add the mesh to the group
      group.add(mesh);
    }
  }

  return group;
}


  