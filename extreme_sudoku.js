// My Pseudo : Sarazar928Ghost

let sudoku;
let number; // generate random
let line;
let size;
let checkLine;
let impossible;
let undo;
let square;
let usedNum;
let usedNumber;
let holes;

/**
 * Generate the array Sudoku;;;
 * puzzle = The array Sudoku with hole;;;
 * solved = The full array Sudoku;;;
 * holes = Number of holes in the sudoku;;;
 * 3x3 Holes ( Best : 46 ; Bad : 30);;;
 * 4x4 Holes ( Best : 118; Bad : 91)
 * 
 * @param int sizeOfTheSudoku 2 , 3 or 4
 * @param string type 'line' or 'grid' ( Default is line )
 * @returns object {puzzle, solved, holes}
 */
function extreme_sudoku(sizeGrid = 3, type = 'line')
{
    holes = square;
    if(sizeGrid <= 1){
        sizeGrid = 2;
    }
    line = 0;
    checkLine = 0;
    impossible = 0;
    undo = 0;
    size = sizeGrid;
    square = size * size;
    let multiplicator = size >= 3 ? size - 3 + 1 : 1;
    sudoku = createArray2D(sudoku);
    usedNum = square;
    usedNumber = new Array(square);
    // Generate the first line
    for(let i = 0; i < square; i++)
    {
        number = getRandomInt();
        if(sudoku[line].includes(number)){
            --i;
            continue;
        }
        sudoku[line][i] = number;
    }
    
    for(let i = square; i < square*square; i++){
        line = Math.floor(i / square);
        checkLine = line - 1;
        number = getRandomInt();
        for(let j = checkLine; j > -1; j--){
            // Si il est bloqué sur une ligne , il va retourné sur celle d'au dessus.
            if(undo > 75 && line > multiplicator)
            {
                resetNumberUsed();
                undo = 0;
                i = reset(i) - square;
                line = Math.floor(i / square);
                sudoku[line] = new Array(square);

                if(multiplicator >= 2){
                    i -= square;
                    line = Math.floor(i / square);
                    sudoku[line] = new Array(square);
                }
                

                checkLine = line - 1;
                j = checkLine + 1;
                continue;
            }
            // Si il bloque sur une ligne on la supprime et recommence
            if(impossible >= 155 * multiplicator)
            {
                i = reset(i);
                j = checkLine + 1;
                continue;
            }
            // Si le numéro juste au dessus est le même ou bien si le numéro est déjà dans la ligne
            if(sudoku[line].includes(number) || sudoku[j][i % square] === number){
                ++impossible;
                number = getRandomInt();
                j = checkLine + 1;
                continue;
            }
            // On prend le block dans lequel le nombre se situe
            // PS : Le nombre n'a pas encore été posé. 
            const X = Math.floor((i % square) / size) * size; // Block axe X
            const Y = Math.floor(i / square / size) * size; // Block axe Y
            // sudoku[Y][X] === number
            // On vérifie tout le block si il n'y a pas déjà le nombre
            for(let k = 0; k < square; k++){
                const ky = Math.floor(k/size) + Y;
                const kx = X + (k % size);
                if(sudoku[ky][kx] === number){
                    ++impossible;
                    number = getRandomInt();
                    j = checkLine + 1;
                    break;
                }
            }
        }
        // Tout s'est bien passé , on ajoute le nombre et reset la variable impossible
        sudoku[line][i % square] = number;
        if(i%square === 0)
        {
            resetNumberUsed();
        }
        usedNumber[i % square] = number;
        impossible = 0;
    }

    let copy_sudoku = getGridArraySudoku();
    
    let array_with_holes;
    array_with_holes = createArray2D(array_with_holes, copy_sudoku);
    array_with_holes = holeArraySudoku(array_with_holes);

    if(type === 'line')
    {
        copy_sudoku = sudoku; // Sudoku de base est en format line
        array_with_holes = toLineArray(array_with_holes);
    }

    return {puzzle: array_with_holes, solved: copy_sudoku, holes};
}

function toLineArray(array_with_holes)
{
    let array_with_holes_line;
    array_with_holes_line = createArray2D(array_with_holes_line);
    for(let i = 0; i < square; i++)
    {
        for(let j = 0; j < square; j++)
        {
            array_with_holes_line[i][j] = array_with_holes[size * Math.floor(i / size) + Math.floor(j / size)][j%size + (i % size) * size];
        }
    }
    return array_with_holes_line;
}

function holeArraySudoku(copy_array)
{
    // Retire ${square} case au total
    firstHoles(copy_array);
    // Valeurs retiré de la grille sudoku
    let valueRemovedNumber = [];
    let valueRemovedBlock = [];
    let currentBlock = new Array(square).fill(0);
    let blockX, blockY;
    for(let i = 0; i < square; i++) // Parcours chaque valeur
    {
        // Random pour les nombres a enlever
        let value = randomInt(square);
        value = value === 0 ? 1 : value;
        if(valueRemovedNumber.includes(value))
        {
            --i;
            continue;
        }
        valueRemovedNumber.push(value);
        valueRemovedBlock = [];
        for(let j = 0; j < square; j++) // Parcours chaque block
        {
            let positionOfBlock = randomInt(square - 1);
            if(valueRemovedBlock.includes(positionOfBlock))
            {
                --j;
                continue;
            }
            valueRemovedBlock.push(positionOfBlock);
            let indexOf = copy_array[positionOfBlock].indexOf(value);
            if(indexOf !== -1)
            {
                blockY = Math.floor(positionOfBlock / size); // Block sur l'axe Y
                blockX = positionOfBlock % size; // Block sur l'axe X

                for(let axeY = blockX; axeY < square; axeY+=size)
                {
                    if(axeY !== positionOfBlock)
                    {
                        indexOf = copy_array[axeY].indexOf(value);
                        if(indexOf !== -1)
                        {
                            for(let m = indexOf % size; m < square; m+=size)
                            {
                                currentBlock[m] = 1;
                            }
                        }


                    }
                }
                for(let axeX = blockY * size; axeX < blockY * size + size; axeX++)
                {
                    if(axeX !== positionOfBlock)
                    {
                        indexOf = copy_array[axeX].indexOf(value);
                        if(indexOf !== -1)
                        {
                            for(let m = Math.floor(indexOf / size) * size; m < Math.floor(indexOf / size) * size + size; m++)
                            {
                                currentBlock[m] = 1;
                            }
                        }
                    }
                }
                let numberOfZero = 0;
                for(let m = 0; m < square; m++)
                {
                    if(currentBlock[m] === 0)
                    {
                        ++numberOfZero;
                    }
                }

                indexOf = copy_array[positionOfBlock].indexOf(value);
                if(numberOfZero !== 1){
                    for(let m = 0; m < square; m++)
                    {
                        if(currentBlock[m] === 0 && indexOf !== m && copy_array[positionOfBlock][m] !== '.')
                        {
                            if(numberOfZero > 1)
                            {
                                --numberOfZero;
                            }
                            
                        }
                    }
                }
                
                if(numberOfZero === 1)
                {
                    copy_array[positionOfBlock][currentBlock.indexOf(0)] = '.';
                    ++holes;
                }
            }
            // Je reset de cette manière question performance niveau mémoire
            for(let m = 0; m < square; m++)
            {
                currentBlock[m] = 0;   
            }
        }
    }

    return copy_array;
}

function firstHoles(copy_array)
{
        // Valeurs retiré de la grille sudoku
        let valueRemoved = [];
        // On retire un nombre par block , chaque nombre est différent
        for(let i = 0; i < square; i++)
        {
            for(let j = 1; j < square + 1; j++) // test toute les valeurs possible
            {
                if(!valueRemoved.includes(j))
                {
                    let indexOf = copy_array[i].indexOf(j);
                    copy_array[i][indexOf] = '.';
                    valueRemoved.push(j);
                    break; // Si trouvé on sort de la boucle
                }
            }
        }
}

/**
 * One line = 1 block
 * Example : sudoku[0] == first block; sudoku[1] == second block
 * 
 * @returns sudoku array format grid
 */
function getGridArraySudoku()
{
    let copy_array = new Array(square);
    let copy_case;
    let done;
    let next;
    let index = 0;
    let X, Y;
    for(let k = 0; k < square; k+=size){
        if(done === square){
            copy_array[index++] = copy_case;
        }
        copy_case = new Array(square);
        done = 0;
        next = 0;
        for(let i = 0; i < square; i++)
        {
            if(done === square){
                copy_array[index++] = copy_case;
                done = 0;
            }
            if(i !== 0 && i % size === 0){
                copy_case = new Array(square);
                ++next;
            }
            for(let j = 0; j < size; j++){
                X = j + next * size;
                Y = i - next * size + k;
                copy_case[done++] = sudoku[Y][X];
            }
        }
    }
    if(done === square){
        copy_array[index] = copy_case;
    }
    return copy_array;
}

function resetNumberUsed(){
    for(let i = 0; i < square; i++)
    {
        usedNumber[i] = 0;
    }
    usedNum = square;
}

// If the code is stuck to generate a line
function reset(i)
{
    impossible = 0;
    ++undo;
    resetNumberUsed();
    sudoku[line] = new Array(square).fill(0);
    number = getRandomInt();
    return i - (i % square);
}

/**
 * Return number between 0 and max include
 * 
 * @param int max is include
 * @returns random number
 */
function randomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max + 1));
}

// Generate a random number between 1 and max , max include
function getRandomInt() {
    
    if(usedNumber.includes(usedNum) && usedNum !== 1)
    {
        --usedNum;
    }
    let random = randomInt(usedNum);
    return random == 0 ? 1 : random;
}

function createArray2D(array, copy = null)
{
    array = new Array(square);
    for(let i = 0; i < square; i++)
    {
        array[i] = new Array(square);
    }
    if(copy !== null)
    {
        for(let i = 0; i < square; i++)
        {
            for(let j = 0; j < square; j++)
            {
                array[i][j] = copy[i][j];
            }
        }
    }

    return array;
}


module.exports = extreme_sudoku;
