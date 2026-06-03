const cellSize = 32;
const canvasWidth = 20;
const canvasHeight = 20;


let ctx = {};
let mouseX = 0;
let mouseY = 0;
const seeInfor = false;

const listBtn = [
    'Inicio',
    'Fin',
    'Pared',
    'Borrar'
];
const listBtnControl = [
    'play','clean', 'reset', 'meowmorcito'
];
gridVisited = [];
let foundNode = null;
let currentAction = null;
let startPoint = null;
let endPoint = null;
let valorMinimo = null;


let grid = [];



initCanvas();
initBotons();

function initCanvas(){
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth * cellSize;
    canvas.height = canvasHeight * cellSize;
    definirGrid();
    // dibugar un texto en el canvas
    drawCell(ctx, 1, 1, 'red');
    
}

function initBotons(){
    const board = document.getElementById('myBoard');
    strClass = `
        btn-pincel 
        bg-gray-300 text-black p-2 m-1 rounded hover:bg-gray-400`;
    for(let i = 0; i < listBtn.length; i++){
        const button = document.createElement('button');
        button.className = strClass;
        button.textContent = listBtn[i];
        button.setAttribute('data-action', listBtn[i]);
        button.addEventListener('click', (e) => {
            currentAction = listBtn[i];
            // si toca el boton entonces cambia de color y los demas en blanco, para indicar que esta seleccionado
            if (currentAction === e.target.getAttribute('data-action')) {
                e.target.classList.add('bg-blue-500', 'text-white');
                e.target.classList.remove('bg-gray-300', 'text-black');
                // quitar la clase de los demas botones
                const buttons = document.querySelectorAll('#myBoard button');
                buttons.forEach(btn => {
                    if (btn !== e.target) {
                        btn.classList.remove('bg-blue-500', 'text-white');
                        btn.classList.add('bg-gray-300', 'text-black');
                    }
                });
            }

            //console.log("currentAction: ", currentAction);
        });
        board.appendChild(button);
    }
    const control = document.getElementById('myControl');
    for(let i = 0; i < listBtnControl.length; i++){
        const button = document.createElement('button');
        button.className = strClass;
        button.setAttribute('data-action', listBtnControl[i]);
        button.textContent = listBtnControl[i];
        //play();
        button.addEventListener('click', (e) => {
            currentAction = listBtnControl[i];
            if (currentAction === 'play') {
                play();
            } else if (currentAction === 'clean') {
                clean();
            } else if (currentAction === 'reset') {
                reset();
            }
            //console.log("currentAction: ", currentAction);
        });
        control.appendChild(button);
    }
    // modificar su clase para que se vea diferente al resto de botones

}


function definirGrid(){
    //console.log("definirGrid");
    for(let i = 0; i < canvasHeight; i++){
        for(let j = 0; j < canvasWidth; j++){
            if (startPoint && startPoint.x === j && startPoint.y === i) {
                grid[`${j}-${i}`] = {
                    valor: 'Inicio',
                    a: null,
                    b: null
                };
                continue;
            }
            else if (endPoint && endPoint.x === j && endPoint.y === i) {
                grid[`${j}-${i}`] = {
                    valor: 'Fin',
                    a: null,
                    b: null
                };
                continue;
            }else if (grid[`${j}-${i}`] && grid[`${j}-${i}`].valor === 'Pared') {
                grid[`${j}-${i}`] = {
                    valor: 'Pared',
                    a: null,
                    b: null
                };
                continue;
            }else{
                grid[`${j}-${i}`] = {
                    valor: null,
                    a: null,
                    b: null
                };
            }

        }
    }


//     let startPoint = {x: 3, y: 2};
// let endPoint = {x: 8, y: 9};
    drawGrid();
    //console.log("grid", grid);
}


function drawCell(x, y, color){
    // dibujar un rectangulo en el canvas
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

    // dibujar un borde al rectangulo
    // ctx.fillStyle = '#f0f0f0';
    // ctx.beginPath();
    // ctx.moveTo(x * cellSize, y * cellSize);
    // ctx.lineTo(x * cellSize + cellSize, y * cellSize);
    // ctx.lineTo(x * cellSize + cellSize, y * cellSize + cellSize);
    // ctx.lineTo(x * cellSize, y * cellSize + cellSize);
    // ctx.closePath();
    // ctx.stroke();

    if (seeInfor){
        // dibujar el texto de posicion
        ctx.fillStyle = 'black';
        const fontSize = 10;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `(${x},${y})`, 
            x * cellSize + cellSize / 2, 
            (y * cellSize) + (cellSize-fontSize)+4);


        const cell = grid[`${x}-${y}`];

        if (cell && cell.a !== null) {
            ctx.fillText(`${cell.a}`, (x * cellSize) + 15, (y * cellSize) + 8);
        }

        if (cell && cell.b !== null) {
            ctx.fillText(`${cell.b}`, (x * cellSize) + 48, (y * cellSize) + 8);
        }

        if (cell && cell.a !== null && cell.b !== null) {
            const f = cell.a + cell.b;
            valorMinimo = valorMinimo === null ? f : Math.min(valorMinimo, f);
            ctx.fillText(`${f}`, (x * cellSize) + cellSize/2, (y * cellSize) + cellSize/2);
        }
    }

    //console.log("drawCell: ", grid[`${x}-${y}`]);
}





// Obtener la posision del mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

    mouseX = Math.floor(x/cellSize);
    mouseY = Math.floor(y/cellSize);


  document.getElementById('pos_x').value = `X: ${x}, Y: ${y}`;
  document.getElementById('pos_y').value = `X: ${mouseX}, Y: ${mouseY}`;

});


canvas.addEventListener("click", (e) => {
    drawCell(mouseX, mouseY, "red");
    if (currentAction === 'Inicio') {
        if (startPoint) {
            grid[`${startPoint.x}-${startPoint.y}`].valor = null;
        }
        startPoint = { x: mouseX, y: mouseY };
        grid[`${mouseX}-${mouseY}`].valor = currentAction;
    } else if (currentAction === 'Fin') {
        if (endPoint) {
            grid[`${endPoint.x}-${endPoint.y}`].valor = null;
        }
        endPoint = { x: mouseX, y: mouseY };
        grid[`${mouseX}-${mouseY}`].valor = currentAction;
    } else if (currentAction === 'Pared') {
        grid[`${mouseX}-${mouseY}`].valor = currentAction;
    } else if (currentAction === 'Borrar') {
        if (grid[`${mouseX}-${mouseY}`].valor === 'Inicio') {
            startPoint = null;
        }else if (grid[`${mouseX}-${mouseY}`].valor === 'Fin') {
            endPoint = null;
        }

        grid[`${mouseX}-${mouseY}`].valor = null;
    }
    //setvalueGrid();
    drawGrid();
});

function drawGrid(){
    for(let i = 0; i < canvasHeight; i++){
        for(let j = 0; j < canvasWidth; j++){
            if (grid[`${j}-${i}`].valor === 'Inicio') {
                drawCell(j, i, 'green');
            } else if (grid[`${j}-${i}`].valor === 'Fin') {
                drawCell(j, i, 'red');
            } else if (grid[`${j}-${i}`].valor === 'Pared') {
                drawCell(j, i, 'gray');
            } else if (grid[`${j}-${i}`].valor === 'visitado') {
                drawCell(j, i, '#bbecff');
            } else if (grid[`${j}-${i}`].valor === 'PATY') {
                drawCell(j, i, 'yellow');
            } else{
                drawCell(j, i, 'white');
            }
        }
    }
}

function setvalueGrid(){
    if (startPoint !== null && endPoint !== null) {
        for(let i = 0; i < canvasHeight; i++){
            for(let j = 0; j < canvasWidth; j++){
                if (grid[`${j}-${i}`].valor !== 'Pared') {

                    const ax = startPoint.x - j;
                    const ay = startPoint.y - i;
                    grid[`${j}-${i}`].a = Math.hypot(ax, ay).toFixed(1)*10;
                    const bx = endPoint.x - j;
                    const by = endPoint.y - i;
                    grid[`${j}-${i}`].b = Math.hypot(bx, by).toFixed(1)*10;
                }else{
                    grid[`${j}-${i}`].a = null;
                    grid[`${j}-${i}`].b = null;
                }
            }
        }
    }
}



function play(){

    if (!startPoint || !endPoint) {
        alert("Por favor, establece el punto de inicio y final.");
        return;
    }
    clean();

    step = 0;
    while (step < (canvasWidth * canvasHeight)) {
        step++;
        
        if (step < 5) console.log("step:::::::::::::::::::::::::::: ", step);
        if (step === 1) {
            console.log("paso inicial");
            x = startPoint.x;
            y = startPoint.y;
            grid[`${x}-${y}`];

            console.log("x: ", x, "y: ", y);
            for(let i = -1; i <= 1; i++){
                for(let j = -1; j <= 1; j++){
                    // verificar que no se salga del canvas
                    if (x+j < 0 || x+j >= canvasWidth || y+i < 0 || y+i >= canvasHeight) {
                        continue;
                    }
                    // verificar que no sea una pared
                    if (grid[`${x+j}-${y+i}`].valor === 'Pared') {
                        continue;
                    }
                    // verificar que no sea el centro
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    grid[`${x+j}-${y+i}`].valor = 'visitado';
                    const ax = startPoint.x - (x+j);
                    const ay = startPoint.y - (y+i);
                    grid[`${x+j}-${y+i}`].a = Math.hypot(ax, ay).toFixed(1)*10;
                    const bx = endPoint.x - (x+j);
                    const by = endPoint.y - (y+i);
                    grid[`${x+j}-${y+i}`].b = Math.hypot(bx, by).toFixed(1)*10;
                    gridVisited.push({ 
                        x: x+j, 
                        y: y+i, 
                        f: grid[`${x+j}-${y+i}`].a + grid[`${x+j}-${y+i}`].b,
                        org: { x: x, y: y },
                        status: 'ACTIVE'
                    });
                }
            }
            
        }else{
            console.log("paso siguiente");
            gridStep = [];
            // obtener los nodos activos
            const activeNodes = gridVisited.filter(node => node.status === 'ACTIVE')
            // ordenar los nodos activos por el menor f y menor de (endPoint - nodo) en caso de empate
            activeNodes.sort((a, b) => {
                if (a.f === b.f) {
                    const aDist = Math.hypot(endPoint.x - a.x, endPoint.y - a.y);
                    const bDist = Math.hypot(endPoint.x - b.x, endPoint.y - b.y);
                    console.log("aDist: ", aDist, "bDist: ", bDist);
                    return aDist - bDist;
                }
                return a.f - b.f;
            });

            console.log("activeNodes: ", activeNodes);
            if (activeNodes.length === 0) {
                console.log("No hay nodos activos, terminando el ciclo.");
                break;
            }
            const gV = activeNodes[0];
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const x = gV.x + j;
                    const y = gV.y + i;
                    // verificar que no se salga del canvas
                    if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) {
                        continue;
                    }
                    // verificar que no sea una pared o un nodo visitado
                    if (grid[`${x}-${y}`].valor === 'Pared' || grid[`${x}-${y}`].valor === 'visitado') {
                        continue;
                    }
                    // verificar que no sea el centro del nodo actual
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    const ax = startPoint.x - x;
                    const ay = startPoint.y - y;
                    grid[`${x}-${y}`].a = Math.hypot(ax, ay).toFixed(1)*10;
                    const bx = endPoint.x - x;
                    const by = endPoint.y - y;
                    grid[`${x}-${y}`].b = Math.hypot(bx, by).toFixed(1)*10;
                    grid[`${x}-${y}`].valor = 'visitado';

                    // obtener los nuevos nodos para ver si alguno no tiene camino o no se creo ninguno de sus vecinos para marcarlo como nodo sin salida
                    gridStep.push({ 
                        x: x, 
                        y: y, 
                        f: grid[`${x}-${y}`].a + grid[`${x}-${y}`].b,
                        org: { x: gV.x, y: gV.y },
                        status: 'ACTIVE'
                    });


                }
            }
            // si gridStep esta vacio, marcar el nodo actual como Inactive por no tener vecinos disponibles
            if (gridStep.length === 0) {
                gridVisited = gridVisited.map(node => {
                    if (node.x === gV.x && node.y === gV.y) {
                        node.status = 'INACTIVE';
                    }
                    return node;
                });
            }


            // integrar gridStep a gridVisited, si ya existe un nodo con la misma posicion y un f menor, no agregarlo
            gridStep.forEach(newNode => {
                const existingNode = gridVisited.find(node => node.x === newNode.x && node.y === newNode.y);
                if (!existingNode) {
                    gridVisited.push(newNode);
                } else if (newNode.f < existingNode.f) {
                    existingNode.f = newNode.f;
                    existingNode.org = newNode.org;
                    existingNode.status = 'ACTIVE';
                }
            });

            // si algun nodo de gridVisited tiene el mismo x e y que endPoint, entonces marcar status como 'FOUND' junto con el nodo de origen segun node.org para luego marcar el camino encontrado desde endPoint hasta startPoint usando los nodos de origen
            foundNode = gridVisited.find(node => node.x === endPoint.x && node.y === endPoint.y);
            if (foundNode) {
                step = canvasWidth * canvasHeight; // Terminar el ciclo
            }       
        }

    }
    // marcar el camino encontrado desde endPoint hasta startPoint usando los nodos de origen
    if (foundNode) {
        let currentNode = foundNode;
        while (currentNode.x !== startPoint.x || currentNode.y !== startPoint.y) {
            grid[`${currentNode.x}-${currentNode.y}`].valor = 'PATY';
            currentNode = gridVisited.find(node => node.x === currentNode.org.x && node.y === currentNode.org.y);
        }
    }
    grid[`${startPoint.x}-${startPoint.y}`].valor = 'Inicio';
    grid[`${endPoint.x}-${endPoint.y}`].valor = 'Fin';

    drawGrid();
}

function reset(){
    grid = [];
    gridVisited = [];
    foundNode = null;
    currentAction = null;
    startPoint = null;
    endPoint = null;
    valorMinimo = null;
    definirGrid();
}
function clean(){
    gridVisited = [];
    foundNode = null;
    valorMinimo = null;
    for(let i = 0; i < canvasHeight; i++){
        for(let j = 0; j < canvasWidth; j++){
            if (grid[`${j}-${i}`].valor === 'visitado' || grid[`${j}-${i}`].valor === 'PATY') {
                grid[`${j}-${i}`].valor = null;
                grid[`${j}-${i}`].a = null;
                grid[`${j}-${i}`].b = null;
            }
        }
    }
    console.log(`startPoint: ${startPoint.x}-${startPoint.y}, endPoint: ${endPoint.x}-${endPoint.y}`);
    definirGrid();
}