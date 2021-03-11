// node testAlgoSudoku

let tab;
let number = 0;
let line = 0;
let size;
let checkLine = 0;
let impossible = 0;
let recommencer = 0;
let square;
let usedNum;
let usedNumber;


function extreme_sudoku(sizeGrid = 3)
{
    if(sizeGrid <= 1){
        sizeGrid = 2;
    }
    size = sizeGrid;
    square = size * size;
    let multiplicator = size >= 3 ? size - 3 + 1 : 1;
    tab = new Array(square);
    for(let i = 0; i < size * size; i++)
    {
        tab[i] = new Array(square).fill(0);
    }
    usedNum = square;
    usedNumber = new Array(square).fill(0);
    // Generate the first line
    for(let i = 0; i < square; i++)
    {
        number = getRandomInt();
        if(tab[line].includes(number)){
            --i;
            continue;
        }
        tab[line][i] = number;
    }
    
    for(let i = square; i < square*square; i++){
        line = Math.floor(i / square);
        checkLine = line - 1;
        number = getRandomInt();
        for(let j = checkLine; j > -1; j--){
            // Si il est bloqué sur une ligne , il va retourné sur celle d'au dessus.
            if(recommencer > 75 && line > 1)
            {
                resetNumberUsed();
                recommencer = 0;
                i = reset(i) - square;
                line = Math.floor(i / square);
                tab[line] = new Array(square).fill(0);
                checkLine = line - 1;
                j = checkLine + 1;
                continue;
            }
            // Si il bloque sur une ligne on la supprime et recommence
            if(impossible >= 155)
            {
                i = reset(i);
                j = checkLine + 1;
                continue;
            }
            // Si le numéro juste au dessus est le même ou bien si le numéro est déjà dans la ligne
            if(tab[line].includes(number) || tab[j][i % square] === number){
                ++impossible;
                number = getRandomInt();
                j = checkLine + 1;
                continue;
            }
            // On prend le block dans lequel le nombre se situe
            // PS : Le nombre n'a pas encore été posé. 
            const X = Math.floor((i % square) / size) * size; // Block axe X
            const Y = Math.floor(i / square / size) * size; // Block axe Y
            // tab[Y][X] === number
            // On vérifie tout le block si il n'y a pas déjà le nombre
            for(let k = 0; k < square; k++){
                const ky = Math.floor(k/size) + Y;
                const kx = X + (k % size);
                if(tab[ky][kx] === number){
                    ++impossible;
                    number = getRandomInt();
                    j = checkLine + 1;
                    break;
                }
            }
        }
        // Tout s'est bien passé , on ajoute le nombre et reset la variable impossible
        tab[line][i % square] = number;
        if(i%square === 0)
        {
            resetNumberUsed();
        }
        usedNumber[i % square] = number;
        impossible = 0;
    }


    return createTabFormatGrid();
}

/**
 * One line = 1 block
 * Example : tab[0] == first block; tab[1] == second block
 * 
 * @returns sudoku tab format grid
 */
function createTabFormatGrid()
{
    // Create copy tab
    let copy_tab = new Array(square);
    let copy_case;
    let done;
    let next;
    let index = 0;
    for(let k = 0; k < square; k+=size){
        copy_case = new Array(square);
        if(done === square){
            copy_tab[index++] = copy_case;
        }
        done = 0;
        next = 0;
        for(let i = 0; i < square; i++)
        {
            if(done === square){
                copy_tab[index++] = copy_case;
                done = 0;
            }
            if(i !== 0 && i % size === 0){
                copy_case = new Array(square);
                ++next;
            }
            for(let j = 0; j < size; j++){
                copy_case[done++] = tab[i - next * size + k][j + next * size];
            }
        }
    }
    if(done === square){
        copy_tab[index++] = copy_case;
    }

    return copy_tab;
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
    ++recommencer;
    resetNumberUsed();
    tab[line] = new Array(square).fill(0);
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


module.exports = extreme_sudoku;
