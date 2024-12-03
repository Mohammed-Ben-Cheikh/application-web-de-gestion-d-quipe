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
        fetch('/json/players.json')
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


