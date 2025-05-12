'use strict';   // Mode strict du JavaScript

// Variables globales
let round = 1;
let scoreKnight = 0;
let scoreDragon = 0;
let pv_knight = 100;
let pv_dragon = 100;
let difficulty = 2;

let tabImage = ['images/knight.png', 'images/dragon.png'];


/*************************************************************************************************/
/* *********************************** FONCTIONS UTILITAIRES *********************************** */
/*************************************************************************************************/


function getRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function throwDices(dices, sides)
{
    // Déclaration des variables locales à la fonction throwDices()
    let index;
    let sum;

    // Initialisation de la somme des dés à 0
    sum = 0;

    /*
      dices = nombre de jets de dés
      Pour chaque jet de dé, le tirage renvoie un nombre entier compris entre 1 et le nombre de faces du dé
    */
    // Pour chaque jet de dé : un tirage aléatoire compris dans [1,sides]
    for(index = 0 ; index < dices ; index++){
        // ...on le lance et on ajoute sa valeur à la somme totale
        sum += getRandomInteger(1, sides);
    }

    // Retour en résultat de la somme totale des dés
    return sum;
}

function requestInteger(message, min, max)
{
    let integer;

    /*
     * La boucle s'exécute tant que l'entier n'est pas un nombre (fonction isNaN()) et
     * n'est pas compris entre les arguments min et max -> [min,max].
     */
    do
    {
        // On demande à l'utilisateur de saisir un nombre entier.
        integer = parseInt(window.prompt(message));
    }
    while(isNaN(integer) == true || integer < min || integer > max);

    return integer;
}


/*************************************************************************************************/
/* *********************************** FONCTIONS UTILITAIRES *********************************** */
/*************************************************************************************************/

function chooseDifficulty() {
    let getDifficulty = window.prompt('Choisissez la difficulté :\n1 : Facile | 2 : Normale | 3 : Difficile');
    getDifficulty = parseInt(getDifficulty);
    difficulty = getDifficulty;

    switch (getDifficulty) {
        case 1: // Facile
            pv_dragon = 100 + throwDices(5, 10);
            pv_knight = 100 + throwDices(10, 10);
            break;
        case 2: // Normal
            pv_dragon = 100 + throwDices(10, 10);
            pv_knight = 100 + throwDices(10, 10);
            break;
        case 3: // Difficile
            pv_dragon = 100 + throwDices(10, 10);
            pv_knight = 100 + throwDices(7, 10);
            break;
        default:
            alert("Choix invalide. Merci de choisir 1, 2 ou 3 !");
            return;
    }

    document.getElementById('btnPlayGame').style.display = 'none';
    createFightArea();
}

function createFightArea() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    // Titre de la manche
    const titleRound = document.createElement('h2');
    titleRound.id = 'roundTitle';
    titleRound.textContent = 'Manche : ' + round;
    gameArea.appendChild(titleRound);

    // Container des personnages
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.gap = '100px';
    container.style.marginTop = '50px';

    // Chevalier
    const knightDiv = document.createElement('div');
    knightDiv.style.textAlign = 'center';

    const knightImg = document.createElement('img');
    knightImg.src = tabImage[0];
    knightImg.style.width = '150px';
    knightDiv.appendChild(knightImg);

    const pvKnightText = document.createElement('p');
    pvKnightText.id = 'pvKnight';
    pvKnightText.textContent = 'PV Chevalier : ' + pv_knight;
    knightDiv.appendChild(pvKnightText);

    // Dragon
    const dragonDiv = document.createElement('div');
    dragonDiv.style.textAlign = 'center';

    const dragonImg = document.createElement('img');
    dragonImg.src = tabImage[1];
    dragonImg.style.width = '150px';
    dragonDiv.appendChild(dragonImg);

    const pvDragonText = document.createElement('p');
    pvDragonText.id = 'pvDragon';
    pvDragonText.textContent = 'PV Dragon : ' + pv_dragon;
    dragonDiv.appendChild(pvDragonText);

    container.appendChild(knightDiv);
    container.appendChild(dragonDiv);

    gameArea.appendChild(container);

    // Bouton pour lancer la manche
    const fightButton = document.createElement('button');
    fightButton.textContent = 'Lancer la manche';
    fightButton.style.margin = '2rem auto';
    fightButton.style.padding = '1rem 3rem';
    fightButton.style.fontSize = '2.5vw';
    fightButton.style.fontFamily = "'Germania One', cursive";
    fightButton.style.color = '#fff';
    fightButton.style.background = 'linear-gradient(to bottom, #ce5804, #d45506)';
    fightButton.style.border = '3px solid #a73602';
    fightButton.style.borderRadius = '1rem';
    fightButton.style.cursor = 'pointer';
    fightButton.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.4)';
    fightButton.style.transition = 'all 0.3s ease';
    fightButton.style.textShadow = '1px 1px 2px black';
    fightButton.style.display = 'block';
    fightButton.style.margin = '2rem auto';

    
    fightButton.onclick = function() {
        fightRoundFunc(pvKnightText, pvDragonText, fightButton);
    };
    fightButton.style.marginTop = '50px';
    gameArea.appendChild(fightButton);
}

// Fonction principale pour gérer un tour de combat
function fightRoundFunc(pvKnightText, pvDragonText, fightButton) {
    round += 1;
    

    // Détermination de l'initiative
    const initiativeKnight = throwDices(1, 10); // Lance 1D10 pour le chevalier
    const initiativeDragon = throwDices(1, 10); // Lance 1D10 pour le dragon

    let attaque = "";
    let dégat = 0;

    // Gestion de l'initiative
    while (initiativeKnight === initiativeDragon) {
        const RoundPlayer = document.createElement('img');
        RoundPlayer.src = "images/shield.png";
        const txtRound = document.createElement('p');
        txtRound.textContent = "égalité, ce round va être relancer...";
        divRoundAction.appendChild(txtRound);
        divRoundAction.appendChild(RoundPlayer);
        return fightRoundFunc(pvKnightText, pvDragonText, fightButton); // Relancer le tour
    }

    const divRoundAction = document.createElement('div');
    divRoundAction.style.display = 'flex';
    divRoundAction.style.flexDirection = 'row';
    divRoundAction.style.alignItems ='center';

    // Décider qui attaque selon l'initiative
    if (initiativeKnight > initiativeDragon) {
        attaque = "knight";
    } else {
        attaque = "dragon";
    }

    // Calcul des dégâts de base
    dégat = throwDices(3, 6); // Lancer 3D6 pour les dégâts de base

    // Appliquer la difficulté et la classe
    if (difficulty === 1) { // Facile
        if (attaque === "knight") {
            let bonus = throwDices(2, 6);
            dégat += Math.floor(dégat * (bonus / 100)); // Majoration de 2D6%
        } else {
            let malus = throwDices(2, 6);
            dégat -= Math.floor(dégat * (malus / 100)); // Minoration de 2D6%
        }
    } else if (difficulty === 3) { // Difficile
        if (attaque === "knight") {
            let malus = throwDices(1, 6);
            dégat -= Math.floor(dégat * (malus / 100)); // Minoration de 1D6%
        } else {
            let bonus = throwDices(1, 6);
            dégat += Math.floor(dégat * (bonus / 100)); // Majoration de 1D6%
        }
    }

    // Appliquer les dégâts
    if (attaque === "knight") {
        pv_dragon -= dégat;
        if (pv_dragon < 0) pv_dragon = 0;
        const RoundPlayer = document.createElement('img');
        RoundPlayer.src = "images/knight.png";
        const txtRound = document.createElement('p');
        txtRound.textContent = "Le chevalier attaque le dragon et lui inflige"+ dégat;
        divRoundAction.appendChild(txtRound);
        divRoundAction.appendChild(RoundPlayer);
    } else {
        pv_knight -= dégat;
        if (pv_knight < 0) pv_knight = 0;
        const RoundPlayer = document.createElement('img');
        RoundPlayer.src = "images/dragon.png";
        const txtRound = document.createElement('p');
        txtRound.textContent = "Le dragon attaque le chevalier et lui inflige"+ dégat;
        divRoundAction.appendChild(txtRound);
        divRoundAction.appendChild(RoundPlayer);
    }

    // Mise à jour des PV
    pvKnightText.textContent = 'PV Chevalier : ' + pv_knight;
    pvDragonText.textContent = 'PV Dragon : ' + pv_dragon;

    const writeRound = document.createElement('h3');
    writeRound.textContent = "Round n°"+ round;

    //affichage du joueur qui attaque
    gameArea.prepend(writeRound); 
    gameArea.prepend(divRoundAction);

    // Mise à jour du numéro de manche
    const titleRound = document.getElementById('roundTitle');
    titleRound.textContent = 'Manche : ' + round;

    // Vérification de la fin du combat
    if (pv_knight === 0) {
        scoreDragon++;
        winGame('Dragon');
    } else if (pv_dragon === 0) {
        scoreKnight++;
        winGame('Chevalier');
    }
}

function winGame(winPlayer) {

    // Création du titre de victoire
    const titleWin = document.createElement('h2');
    titleWin.textContent = `${winPlayer} remporte la manche !`;
    titleWin.style.textAlign = 'center';
    titleWin.style.fontSize = '3vw';
    titleWin.style.color = '#a73602';
    titleWin.style.textShadow = '1px 1px 2px black';

    // Création de l'image du gagnant
    const imageWin = document.createElement('img');
    imageWin.style.display = 'block';
    imageWin.style.margin = '2rem auto';
    imageWin.style.maxWidth = '40%';

    // Détermination de l’image à afficher
    if (winPlayer === 'Dragon') {
        imageWin.src = 'images/dragon-winner.png'; // chemin à adapter
        imageWin.alt = 'Le dragon triomphe';
    } else if (winPlayer === 'Chevalier') {
        imageWin.src = 'images/knight-winner.png'; // chemin à adapter
        imageWin.alt = 'Le chevalier triomphe';
    }

    const btnRePlay = document.createElement('button');
    btnRePlay.textContent = 'Lancer une nouvelle partie';
    btnRePlay.style.margin = '2rem auto';
    btnRePlay.style.padding = '1rem 3rem';
    btnRePlay.style.fontSize = '2.5vw';
    btnRePlay.style.fontFamily = "'Germania One', cursive";
    btnRePlay.style.color = '#fff';
    btnRePlay.style.background = 'linear-gradient(to bottom, #ce5804, #d45506)';
    btnRePlay.style.border = '3px solid #a73602';
    btnRePlay.style.borderRadius = '1rem';
    btnRePlay.style.cursor = 'pointer';
    btnRePlay.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.4)';
    btnRePlay.style.transition = 'all 0.3s ease';
    btnRePlay.style.textShadow = '1px 1px 2px black';
    btnRePlay.style.display = 'block';
    btnRePlay.style.margin = '2rem auto';

    btnRePlay.onclick = function() {
        round = 1;
        chooseDifficulty();
    };

    // Vérification de l'existence de gameArea avant de manipuler son contenu
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
        gameArea.innerHTML = '';
        gameArea.appendChild(titleWin);
        gameArea.appendChild(imageWin);
        gameArea.appendChild(btnRePlay);
    } else {
        console.error('Le conteneur "gameArea" n\'a pas été trouvé.');
    }
}
