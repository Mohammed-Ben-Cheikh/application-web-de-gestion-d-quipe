let toggleOpen = document.getElementById("toggleOpen");
let toggleClose = document.getElementById("toggleClose");
let collapseMenu = document.getElementById("collapseMenu");
function handleClick() {
    if (collapseMenu.style.display === "block") {
        collapseMenu.style.display = "none";
    } else {
        collapseMenu.style.display = "block";
    }
}
toggleOpen.addEventListener("click", handleClick);
toggleClose.addEventListener("click", handleClick);

let joueurChangement = {
    GK: [],
    LB: [],
    CB: [],
    RB: [],
    CM: [],
    LW: [],
    ST: [],
    RW: []
}

let joueurDansTerrain = {
    GK: [],
    LB: [],
    LCB: [],
    RCB: [],
    RB: [],
    LCM: [],
    CM: [],
    RCM: [],
    LW: [],
    ST: [],
    RW: []
}

fetchEtStockerJoueursParPosition()

function fetchEtStockerJoueursParPosition() {
    localStorage.removeItem("joueur Position:");
    const storedPositions = {
        GK: JSON.parse(localStorage.getItem('GK')) || [],
        LB: JSON.parse(localStorage.getItem('LB')) || [],
        CB: JSON.parse(localStorage.getItem('CB')) || [],
        RB: JSON.parse(localStorage.getItem('RB')) || [],
        CM: JSON.parse(localStorage.getItem('CM')) || [],
        LW: JSON.parse(localStorage.getItem('LW')) || [],
        ST: JSON.parse(localStorage.getItem('ST')) || [],
        RW: JSON.parse(localStorage.getItem('RW')) || []
    };


    function hasData(storedPositions) {
        for (const key in storedPositions) {
            if (storedPositions[key].length > 0) {
                return true; // Des données existent
            }
        }
        return false;
    }

    let hasStoredData = hasData(storedPositions);

    if (hasStoredData) {
        console.log("Données trouvées via la fonction !");
    } else {

        for (const key in storedPositions) {
            if (storedPositions[key].length > 0) {
                hasStoredData = true;
                console.log("Données trouvées via la boucle directe !");
                break;
            }
        }
    }

    if (hasStoredData) {
        // Utiliser les données stockées
        console.log("Données chargées depuis le localStorage:", storedPositions);
        joueurChangementFunction()
    } else {
        // Charger depuis le fichier JSON
        fetch('../json/players.json')
            .then(response => response.json())
            .then(data => {
                console.log("Players data:", data.players);
                // Grouper les joueurs par position
                const playersByPosition = {
                    GK: [],
                    LB: [],
                    CB: [],
                    RB: [],
                    CM: [],
                    LW: [],
                    ST: [],
                    RW: []
                };

                // Répartir les joueurs dans leurs positions respectives
                for (let i = 0; i < data.players.length; i++) {
                    let player = data.players[i];
                    if (player.position in playersByPosition) {
                        playersByPosition[player.position].push(player);
                    }
                }

                // Stocker chaque position séparément dans le localStorage
                for (let position in playersByPosition) {
                    if (playersByPosition[position] !== undefined) {
                        let players = playersByPosition[position];
                        localStorage.setItem(position, JSON.stringify(players));
                    }
                }

                console.log("Joueurs organisés et stockés par position:", playersByPosition);

                // Afficher tous les joueurs
                localStorage.setItem("joueurDansTerrain", JSON.stringify(joueurDansTerrain));
                joueurChangementFunction()
            })
            .catch(error => {
                console.error('Erreur de chargement des données:', error);
                document.getElementById('players-container').innerHTML = `
                <p class="text-red-500 text-center">Impossible de charger les données des joueurs.</p>`;
            });
    }
}

for (let position in joueurDansTerrain) {
    let data = JSON.parse(localStorage.getItem("joueurDansTerrain"));
    if (data) {
        joueurDansTerrain[position] = data[position] || []; // Default to an empty array if position is undefined
    } else {
        joueurDansTerrain[position] = []; // Initialize to an empty array if data is null
    }
}

afficherJoueursDansTerrain()

function joueurChangementFunction() {
    for (let position in joueurChangement) {
        joueurChangement[position] = JSON.parse(localStorage.getItem(position));
        localStorage.setItem(position, JSON.stringify(joueurChangement[position]))
    }
    afficherJoueurs(Object.values(joueurChangement).flat());
}

function supprimerJoueurDeChangementFunction(playerName) {
    for (let position in joueurChangement) {
        joueurChangement[position] = JSON.parse(localStorage.getItem(position));
        joueurChangement[position] = joueurChangement[position].filter(player => player.name !== playerName);
        localStorage.setItem(position, JSON.stringify(joueurChangement[position]));
    }
}

console.log("Current player changes:", joueurChangement);

function afficherJoueursParPosition(position) {
    let joueurs = joueurChangement[position];
    if (joueurs.length > 0) {
        afficherJoueurs(joueurs);
    } else {
        const container = document.getElementById('players-container');
        container.innerHTML = `
            <p class="text-yellow-500 text-center">Aucun joueur trouvé pour la position ${position}</p>`;
    }
}

function filterJoueursParPosition(id) {
    const positionMap = {
        "LCB": "CB",
        "RCB": "CB",
        "LCM": "CM",
        "CM": "CM",
        "RCM": "CM"
    };

    const positionToDisplay = positionMap[id] || id; // Use mapped position or the original id
    afficherJoueursParPosition(positionToDisplay);
}

function joueurDansTerrainFunction(playerName,position) {
    let joueurPosition = localStorage.getItem("joueur Position:");
    console.log(joueurPosition);
    let player = null;
    for (let position in joueurChangement) {
        let players = joueurChangement[position];
        if (players && players.length > 0) {
            player = players.find(p => p.name === playerName);
            if (player) {
                for (let position in joueurDansTerrain) {
                    if (joueurPosition === position) {
                        let data = JSON.parse(localStorage.getItem("joueurDansTerrain"));
                        if (joueurDansTerrain[position].length === 0 && data[position].length === 0) {
                            supprimerJoueurDeChangementFunction(playerName)
                            joueurDansTerrain[position].push(player);
                            localStorage.setItem("joueurDansTerrain", JSON.stringify(joueurDansTerrain));
                            afficherJoueursDansTerrain()
                        } else {
                            alert(`Un joueur est déjà présent dans la position ${position}.`);
                        }
                    }
                }
                console.log("Player found:", player);
                break;
            }
        }
    }
    if (!player) {
        console.log("Player not found");
    }
    localStorage.removeItem("joueur Position:");
    joueurChangementFunction()
    document.getElementById("svg").classList.remove("animate-spin");
}

function afficherJoueursDansTerrain() {
    let joueurDansTerrain = JSON.parse(localStorage.getItem("joueurDansTerrain"));
    for (let position in joueurDansTerrain) {
        if (joueurDansTerrain[position] && joueurDansTerrain[position].length > 0) {
            console.log(`Players in position ${position}:`, joueurDansTerrain[position]);
            const playersInPosition = joueurDansTerrain[position];
            const validPositions = ['GK', 'LB', 'LCB', 'RCB', 'RB', 'LCM', 'CM', 'RCM', 'LW', 'ST', 'RW'];
            if (validPositions.includes(position)) {
                localStorage.setItem("joueur Position:", position);
                let playerCardsHTML;
                for (let player of playersInPosition) {
                    if (player.position === "GK") {
                        playerCardsHTML = `
            <div onclick="createEmptyCard(this.parentElement.id,'${player.position}','${player.name}')" class="h-full relative p-1">
                <div class="relative bg-black rounded-lg shadow-lg h-[150px] transition-transform hover:scale-105 cursor-pointer">
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 opacity-20 rounded-lg group-hover:blur-lg transition-all duration-300">
                    </div>
                    <div class="relative p-1 h-full flex flex-col justify-around">
                        <div class="flex justify-between items-center">
                            <div class="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                <span class="text-[0.65rem] font-bold">${player.rating}</span>
                            </div>
                            <!-- Photo du joueur -->
                            <div class="flex justify-center -mt-2">
                                <img src="${player.photo}" alt="${player.name}"
                                    class="w-10 h-10 rounded-full border-4 border-white object-cover">
                            </div>
                            <div class="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                <span class="text-[0.65rem] font-bold">${player.position}</span>
                            </div>
                        </div>
                        <div class="text-center">
                            <h2 class="text-[0.65rem] font-bold text-white mb-1">${player.name}</h2>
                        </div>
                        <div class="flex justify-center items-center gap-1">
                            <img src="${player.flag}" alt="Drapeau" class="w-4 h-2 rounded shadow">
                            <img src="${player.logo}" alt="Club" class="w-4 h-4 rounded shadow">
                        </div>
                        <div class="flex justify-around flex-col gap-1">
                            <div class="flex justify-around">
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">DIV</span>
                                    <span class="text-white block text-[0.65rem]">${player.diving}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">HAN</span>
                                    <span class="text-white block text-[0.65rem]">${player.handling}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">KIC</span>
                                    <span class="text-white block text-[0.65rem]">${player.kicking}</span>
                                </div>
                            </div>
                            <div class="flex justify-around">
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">REF</span>
                                    <span class="text-white block text-[0.65rem]">${player.reflexes}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">SPD</span>
                                    <span class="text-white block text-[0.65rem]">${player.speed}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">POS</span>
                                    <span class="text-white block text-[0.65rem]">${player.positioning}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
                    } else {
                        playerCardsHTML = `
            <div onclick="createEmptyCard(this.parentElement.id,'${player.position}','${player.name}')" class="relative p-1">
                <div class="relative bg-black rounded-lg shadow-lg h-[150px] transition-transform hover:scale-105 cursor-pointer">
                    <!-- Effet de gradient -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 opacity-20 rounded-lg group-hover:blur-lg transition-all duration-300">
                    </div>
                    <!-- Contenu principal -->
                    <div class="relative p-1 h-full flex flex-col justify-around">
                        <!-- En-tête avec rating et position -->
                        <div class="flex justify-between items-center">
                            <div class="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                <span class="text-[0.65rem] font-bold">${player.rating}</span>
                            </div>
                            <!-- Photo du joueur -->
                            <div class="flex justify-center -mt-2">
                                <img src="${player.photo}" alt="${player.name}"
                                    class="w-10 h-10 rounded-full border-4 border-white object-cover">
                            </div>
                            <div class="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                <span class="text-[0.65rem] font-bold">${player.position}</span>
                            </div>
                        </div>
                        <!-- Informations du joueur -->
                        <div class="text-center">
                            <div class="flex flex-col items-center">
                                <h2 class="text-[0.65rem] font-bold text-white mb-1">${player.name}</h2>
                            </div>
                            <div class="flex justify-center items-center gap-1">
                                <img src="${player.flag}" alt="Drapeau" class="w-4 h-4 rounded shadow">
                                <img src="${player.logo}" alt="Club" class="w-4 h-4 rounded shadow">
                            </div>
                        </div>
                        <!-- Statistiques -->
                        <div class="flex justify-around flex-col gap-1">
                            <div class="flex justify-around">
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">PAC</span>
                                    <span class="text-white block text-[0.65rem]">${player.pace}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">SHO</span>
                                    <span class="text-white block text-[0.65rem]">${player.shooting}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">PAS</span>
                                    <span class="text-white block text-[0.65rem]">${player.passing}</span>
                                </div>
                            </div>
                            <div class="flex justify-around">
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">DRI</span>
                                    <span class="text-white block text-[0.65rem]">${player.dribbling}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">DEF</span>
                                    <span class="text-white block text-[0.65rem]">${player.defending}</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <span class="text-white text-[0.65rem] font-bold">PHY</span>
                                    <span class="text-white block text-[0.65rem]">${player.physical}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                        `;
                    }
                    console.log("la position de joueur ajoutée:",player.position);
                }
                // Set the inner HTML for the current position
                document.getElementById(position).innerHTML = playerCardsHTML;
            } else {
                console.error('Position est vide :', position);
            }
        } else {
            console.log(`No players found for position ${position}`);
        }
    }
}

// Fonction pour ajouter dans le terrain
function ajoutDansTerrain(id) {
    document.getElementById("svg").classList.add("animate-spin");
    filterJoueursParPosition(id)
    console.log("Position:", id);
    switch (id) {
        case 'GK':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'LB':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'LCB':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'RCB':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'RB':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'LCM':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'CM':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'RCM':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'LW':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'ST':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        case 'RW':
            localStorage.setItem("joueur Position:", id)
            document.getElementById(id).innerHTML
            break;
        default:
            console.error('Position non reconnue:', id);
    }

}

const searchInput = document.getElementById("search-player");
searchInput.addEventListener("input", () => filterSearch(searchInput.value));

function filterSearch(searchValue) {
    let playersElements = Array.from(document.getElementById("players-container").children);
    searchValue = searchValue.toLowerCase();
    console.log("Searching for:", playersElements); // Debugging line
    console.log("Substitutions array:", joueurChangement);
    playersElements.forEach(function (playerElement) {
        const playerData = playerElement.getAttribute("data");
        console.log(playerElement.classList);
        console.log("Player Data:", playerData);
        // Split playerData into individual attributes
        const [name, position, club, nationality] = playerData.split(',');

        // Pass the correct parameters to checkData
        checkData(name, position, club, nationality);

        function checkData(name, position, club, nationality) {
            if (
                name.toLowerCase().includes(searchValue) ||
                position.toLowerCase().includes(searchValue) ||
                club.toLowerCase().includes(searchValue) ||
                nationality.toLowerCase().includes(searchValue)
            ) {
                playerElement.classList.remove("hidden");
            } else {
                playerElement.classList.add("hidden");
            }
        }
    });
}

// Fonction pour afficher les joueurs
function afficherJoueurs(players) {
    const container = document.getElementById('players-container');
    let cardsHTML = '';

    players.forEach(player => {
        if (player.position === "GK") {
            cardsHTML += `
<div data="${player.name},${player.position},${player.club},${player.nationality}" onclick="joueurDansTerrainFunction('${player.name}','${player.position}')" class="relative w-[80%] p-5">
    <div class="relative bg-black rounded-lg shadow-lg h-[250px] transition-transform hover:scale-105 cursor-pointer">
        <div
            class="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 opacity-20 rounded-lg group-hover:blur-lg transition-all duration-300">
        </div>
        <div class="relative p-4 h-full flex flex-col justify-around">
            <div class="flex justify-between items-center">
                <div class="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <span class="text-lg font-bold">${player.rating}</span>
                </div>
                <!-- Photo du joueur -->
                <div class="flex justify-center -mt-2">
                    <img src="${player.photo}" alt="${player.name}"
                        class="w-20 h-20 rounded-full border-4 border-white object-cover">
                </div>
                <div class="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <span class="text-lg font-bold">${player.position}</span>
                </div>
            </div>
            <div class="text-center">
                <h2 class="text-xl font-bold text-white mb-2">${player.name}</h2>
            </div>
            <div class="flex justify-center items-center gap-3">
                <img src="${player.flag}" alt="Drapeau" class="w-8 h-5 rounded shadow">
                <img src="${player.logo}" alt="Club" class="w-8 h-8 rounded shadow">
            </div>
            <div class="flex justify-around flex-col gap-4">
                <div class="flex justify-around">
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">DIV</span>
                        <span class="text-white block text-sm">${player.diving}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">HAN</span>
                        <span class="text-white block text-sm">${player.handling}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">KIC</span>
                        <span class="text-white block text-sm">${player.kicking}</span>
                    </div>
                </div>
                <div class="flex justify-around">
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">REF</span>
                        <span class="text-white block text-sm">${player.reflexes}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">SPD</span>
                        <span class="text-white block text-sm">${player.speed}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">POS</span>
                        <span class="text-white block text-sm">${player.positioning}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
        } else {
            cardsHTML += `
<div data="${player.name},${player.position},${player.club},${player.nationality}" onclick="joueurDansTerrainFunction('${player.name}','${player.position}')" class="relative w-[80%] p-5">
    <div class="relative bg-black rounded-lg shadow-lg h-[250px] transition-transform hover:scale-105 cursor-pointer">
        <!-- Effet de gradient -->
        <div
            class="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 opacity-20 rounded-lg group-hover:blur-lg transition-all duration-300">
        </div>
        <!-- Contenu principal -->
        <div class="relative p-4 h-full flex flex-col justify-around">
            <!-- En-tête avec rating et position -->
            <div class="flex justify-between items-center">
                <div class="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <span class="text-lg font-bold">${player.rating}</span>
                </div>
                <!-- Photo du joueur -->
                <div class="flex justify-center -mt-2">
                    <img src="${player.photo}" alt="${player.name}"
                        class="w-20 h-20 rounded-full border-4 border-white object-cover">
                </div>
                <div class="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <span class="text-lg font-bold">${player.position}</span>
                </div>
            </div>
            <!-- Informations du joueur -->
            <div class="text-center">
                <div class="flex flex-col items-center">
                    <h2 class="text-xl font-bold text-white mb-2">${player.name}</h2>
                </div>
                <div class="flex justify-center items-center gap-3">
                    <img src="${player.flag}" alt="Drapeau" class="w-8 h-5 rounded shadow">
                    <img src="${player.logo}" alt="Club" class="w-8 h-8 rounded shadow">
                </div>
            </div>
            <!-- Statistiques -->
            <div class="flex justify-around flex-col gap-4">
                <div class="flex justify-around">
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">PAC</span>
                        <span class="text-white block text-sm">${player.pace}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">SHO</span>
                        <span class="text-white block text-sm">${player.shooting}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">PAS</span>
                        <span class="text-white block text-sm">${player.passing}</span>
                    </div>
                </div>
                <div class="flex justify-around">
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">DRI</span>
                        <span class="text-white block text-sm">${player.dribbling}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">DEF</span>
                        <span class="text-white block text-sm">${player.defending}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-white text-sm font-bold">PHY</span>
                        <span class="text-white block text-sm">${player.physical}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
            `;
        }


    });

    container.innerHTML = cardsHTML
}

// fonction pour créer une carte vide
function createEmptyCard(parentElementId, playerPosition, playerName) {
    console.log(1, parentElementId, 2, playerPosition, 3, playerName);
    for (let position in joueurDansTerrain) {
        if (position === parentElementId) {
            console.log(1, position, 2, playerPosition);
            let data1 = JSON.parse(localStorage.getItem("joueurDansTerrain"));
            if (data1[parentElementId].length > 0) {
                if (data1[parentElementId].some(p => p.name === playerName)) {
                    let data2 = JSON.parse(localStorage.getItem(playerPosition));
                    let player = data1[parentElementId].find(p => p.name === playerName);
                    console.log(player);
                    data2.push(player);
                    joueurDansTerrain[position] = [];
                    localStorage.setItem(playerPosition, JSON.stringify(data2));
                    data1[parentElementId] = data1[parentElementId].filter(p => p.name !== playerName);
                    localStorage.setItem("joueurDansTerrain", JSON.stringify(data1));
                    joueurChangementFunction()
                    filterJoueursParPosition(parentElementId)
                } else {
                    alert(`Le joueur ${playerName} n'est pas trouvé dans la position ${position}.`);
                }
            } else {
                alert(`Aucun joueur trouvé dans la position ${position}.`);
            }
        }
    }

    if (parentElementId === "GK" || parentElementId === "LB" || parentElementId === "LCB" || parentElementId === "RCB" || parentElementId === "RB" || parentElementId === "LCM" || parentElementId === "CM" || parentElementId === "RCM" || parentElementId === "LW" || parentElementId === "ST" || parentElementId === "RW") {
        let parentElement = document.getElementById(parentElementId)
        const emptyCard = document.createElement('div');
        emptyCard.innerHTML = `
                                <!-- Carte -->
                        <div
                        class="relative w-[100%] h-[100%] bg-black rounded-lg shadow-lg transition-transform transform hover:scale-105 group">
                        <!-- Effet lumineux au survol -->
                        <div
                            class="bg-green-500 opacity-20 hover:blur-xl rounded-lg group-hover:blur-2xl transition-all duration-300 w-[100%] h-[100%]">
                        </div>
                        <!-- Contenu de la carte -->
                        <div class="absolute inset-0 flex items-center justify-center z-20">
                            <div class="w-4 h-4 md:w-8 md:h-8 border-2 border-green-500 flex items-center justify-center">
                            <span class="text-green-500 md:text-2xl text-lg font-bold">+</span>
                            </div>
                        </div>
                        </div>
                        <!-- Bouton "CB" -->
                        <button
                        class="w-8 h-5 md:w-12 md:h-6 mt-[0.2rem] pt-[0.15rem] bg-gray-900 text-white md:font-medium text-[0.65rem] md:text-sm rounded-full shadow-md hover:bg-gray-700 focus:outline-none">
                        ${playerPosition}
                        </button>`;
        parentElement.innerHTML = emptyCard.innerHTML;
    }
    document.getElementById("svg").classList.remove("animate-spin");
}

function ajouterPlayer() {
    let position = document.getElementById('playerPosition').value.toUpperCase();
    let newPlayer = {};

    // Regex pour valider les champs
    const nameRegex = /^[A-Za-z\s]+$/; // Nom : lettres et espaces uniquement
    const ratingRegex = /^(100|[1-9][0-9]?)$/; // Note : entre 1 et 100
    const photoRegex = /^(http|https):\/\/.+/; // Photo : URL valide
    const flagRegex = /^(http|https):\/\/.+/; // Drapeau : URL valide
    const logoRegex = /^(http|https):\/\/.+/; // Logo : URL valide
    const statsRegex = /^(100|[1-9][0-9]?)$/; // Note : entre 1 et 100

    // Vérification du nom du joueur
    const playerName = document.getElementById('playerName').value;
    if (!nameRegex.test(playerName)) {
        alert("Le nom du joueur doit contenir uniquement des lettres et des espaces.");
        return; // Sortir de la fonction si la validation échoue
    }

    // Vérification de la note
    const playerRating = document.getElementById('playerRating').value;
    if (!ratingRegex.test(playerRating)) {
        alert("La note doit être un nombre entre 1 et 100.");
        return;
    }

    // Vérification de l'URL de la photo
    const playerPhoto = document.getElementById('playerPhoto').value;
    if (!photoRegex.test(playerPhoto)) {
        alert("L'URL de la photo doit être valide.");
        return;
    }

    // Vérification de l'URL du drapeau
    const playerFlag = document.getElementById('nationalitySelect').value;
    if (!flagRegex.test(playerFlag)) {
        alert("L'URL du drapeau doit être valide.");
        return;
    }

    // Vérification de l'URL du logo
    const playerLogo = document.getElementById('clubSelect').value;
    if (!logoRegex.test(playerLogo)) {
        alert("L'URL du logo doit être valide.");
        return;
    }

    // Vérification des statistiques (pour GK)
    if (position === "GK") {
        const diving = document.getElementById('diving').value;
        const handling = document.getElementById('handling').value;
        const kicking = document.getElementById('kicking').value;
        const reflexes = document.getElementById('reflexes').value;
        const speed = document.getElementById('speed').value;
        const positioning = document.getElementById('positioning').value;

        if (![diving, handling, kicking, reflexes, speed, positioning].every(stat => statsRegex.test(stat))) {
            alert("Les statistiques doivent être des nombres.");
            return;
        }

        newPlayer = {
            name: playerName,
            rating: parseInt(playerRating),
            position: position,
            photo: playerPhoto,
            flag: playerFlag,
            logo: playerLogo,
            diving: parseInt(diving),
            handling: parseInt(handling),
            kicking: parseInt(kicking),
            reflexes: parseInt(reflexes),
            speed: parseInt(speed),
            positioning: parseInt(positioning)
        };
        addPlayerToPosition(newPlayer);
    } else {
        // Vérification des statistiques (pour les autres positions)
        const pace = document.getElementById('pace').value;
        const shooting = document.getElementById('shooting').value;
        const passing = document.getElementById('passing').value;
        const dribbling = document.getElementById('dribbling').value;
        const defending = document.getElementById('defending').value;
        const physical = document.getElementById('physical').value;

        if (![pace, shooting, passing, dribbling, defending, physical].every(stat => statsRegex.test(stat))) {
            alert("Les statistiques doivent être des nombres.");
            return;
        }

        newPlayer = {
            name: playerName,
            rating: parseInt(playerRating),
            position: position,
            photo: playerPhoto,
            flag: playerFlag,
            logo: playerLogo,
            pace: parseInt(pace),
            shooting: parseInt(shooting),
            passing: parseInt(passing),
            dribbling: parseInt(dribbling),
            defending: parseInt(defending),
            physical: parseInt(physical)
        }
        addPlayerToPosition(newPlayer);
    }
    document.getElementById("addPlayerForm").classList.add("hidden");
    filterJoueursParPosition(position);
}

// Fonction pour ajouter un joueur à une position spécifique
function addPlayerToPosition(player) {
    const position = player.position;
    for (let key in joueurChangement ){
        if ( key === position ){
            joueurChangement[position].push(player);
        }
    }
    let dataForPosition = JSON.parse(localStorage.getItem(position)) || [];
    console.log(position);
    dataForPosition.push(player);
    localStorage.setItem(position, JSON.stringify(dataForPosition));
}

function afficherFermerFormule(état) {
    let PlayerForm = document.getElementById("addPlayerForm");
    if (état === 'open') {
        PlayerForm.classList.remove("hidden");
    } else {
        PlayerForm.classList.add("hidden");
    }
}

function afficherStats() {
    const playerPosition = document.getElementById('playerPosition').value;
    if (playerPosition === 'GK') {
        document.getElementById('goalkeeperStats').classList.remove('hidden');
        document.getElementById('playerStats').classList.add("hidden");
    } else {
        document.getElementById('playerStats').classList.remove('hidden');
        document.getElementById('goalkeeperStats').classList.add('hidden');
    }
}

function updateClubLogo() {
    const selectElement = document.getElementById("clubSelect");
    const logoImage = document.getElementById("clubLogo");
    const selectedValue = selectElement.value;

    if (selectedValue) {
        logoImage.src = selectedValue; // Set the image source to the selected logo URL
        logoImage.style.display = "block"; // Show the image
    } else {
        logoImage.style.display = "none"; // Hide the image if no selection
    }
}

function updateNationalityFlag() {
    const selectElement = document.getElementById("nationalitySelect");
    const flagImage = document.getElementById("nationalityFlag");
    const selectedValue = selectElement.value;

    if (selectedValue) {
        flagImage.src = selectedValue; // Définir la source de l'image sur l'URL du drapeau sélectionné
        flagImage.style.display = "block"; // Afficher l'image
    } else {
        flagImage.style.display = "none"; // Masquer l'image si aucune sélection
    }
}