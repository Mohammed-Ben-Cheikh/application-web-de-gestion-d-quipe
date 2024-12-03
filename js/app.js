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




