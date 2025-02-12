/*
*	This function creates and displays a chart of the evolution of grades and adds columns for the averages.
*	It also removes any unnecessary columns and rows from the table.
*/
function column(CreateAverageCol) {

    // Display the chart of grades evolution
	document.getElementsByClassName("bloc-legende")[0].remove()
	document.getElementById("encart-notes").innerHTML += "<div id='flex'><div class='bloc-legende clear hidden-print ng-star-inserted' style='grid-row: initial;'><div class='col-md-6 ng-star-inserted'><table><caption>Légende des notes</caption><tbody><tr><td style='width: 70px;'> note <sup>(x)</sup></td><td>Note coefficientée</td></tr><tr><td> note <sub>/X</sub></td><td>Note sur X</td></tr><tr><td>(note)</td><td>Note non significative</td></tr><tr><td><span class='newNote'>note</span></td><td>Nouvelle note</td></tr><!----><tr><td><span class='note-examen-blanc'>note</span></td><td>Examen blanc</td></tr><tr><td>Abs</td><td>Absent</td></tr><tr><td>Disp</td><td>Dispensé</td></tr><tr><td>NE</td><td>Non évalué</td></tr><tr><td>EA</td><td>En attente</td></tr></tbody></table></div></div><canvas id='graphic'></canvas></div>";
    
    // Create columns for the averages
    if (CreateAverageCol) {
        for (var i = document.getElementsByClassName("notes").length - 1; i > 0; i--) {
            document.getElementsByClassName("notes")[i].parentElement.innerHTML = document.getElementsByClassName("notes")[i].parentElement.innerHTML + "<td class=\"average\"></td>";
        }
        document.getElementsByClassName("notes")[0].parentElement.innerHTML = document.getElementsByClassName("notes")[0].parentElement.innerHTML + "<th>Moyennes</th>";
    }

    // Remove graph columns
    for (var i = document.getElementsByClassName("graph").length -1; i >= 0; i--) {
        document.getElementsByClassName("graph")[i].style.display = "none";
    }
    
   // Remove rows without grades
	for (n = document.getElementsByClassName('discipline').length - 1; n >= 1; n--) {
		if (document.getElementsByClassName('discipline')[n].parentElement.getElementsByClassName("notes")[0].innerText == "") {
			if (document.getElementsByClassName('discipline')[n].classList.contains("sousmatiere")) { // si c'est une sous-matiere
				document.getElementsByClassName('discipline')[n].parentElement.remove();
				
			} else if (n == document.getElementsByClassName('discipline').length - 1) { // si c'est la dernière moyenne
				document.getElementsByClassName('discipline')[n].parentElement.remove();
				
			} else if (! document.getElementsByClassName('discipline')[n + 1].classList.contains("sousmatiere")) {
				document.getElementsByClassName('discipline')[n].parentElement.remove();
			}
		}
    }
}

/**
*	This function retrieves the grades of all subjects and calculates their averages.
*	It also adds the coefficient of each subject and some graphics are drawn for each note.
*/
function getMoyenne() {
	notes = {};
	everynotes = {};
	l = 0;

	// add a numerical entry for coefficients
	for (let i =0; i < document.querySelectorAll("td.discipline").length; i++) {
		if (document.querySelectorAll('td.discipline')[i].lastChild.classList?.contains("coef")){
			break;
		} else if (document.querySelectorAll("td.discipline")[i].classList.contains('sousmatiere')) {
		} else{
			document.querySelectorAll("td.discipline")[i].innerHTML += '<input type="number" value="1" min="0" class="coef">';
		} 
	}

    // constEvalPos => find the position of the table columns for evaluations and averages
    x = 0;
    while (document.getElementsByClassName('discipline')[0].parentElement.children[x]) {
        if (document.getElementsByClassName('discipline')[0].parentElement.children[x].innerText == "EVALUATIONS") {
            constEvalPos = x;
            break;
        }
        x++;
    }
    
    // determiner ConstMoyennePos => positions du tableau des notes
    x = 0;
    while (document.getElementsByClassName('discipline')[0].parentElement.children[x]) {
        if (document.getElementsByClassName('discipline')[0].parentElement.children[x].innerText == "MOYENNES") {
            ConstMoyennePos = x;
            break;
        }
        x++;
    }
	
	for (x = 1; x < document.getElementsByClassName('discipline').length; x++) { // pour toutes les matières
		// créer le tableau
		if (notes[document.getElementsByClassName('discipline')[x].firstChild.firstChild.innerHTML] == undefined) {
			if (document.getElementsByClassName('discipline')[x].classList.contains("sousmatiere")) { // créer un nouveau dossier pour la sous matière
				if (document.getElementsByClassName('discipline')[x - 1].classList.contains("sousmatiere")) { // sous matiere avant elle
					notes[document.getElementsByClassName('discipline')[x - 2].firstChild.firstChild.innerHTML][1] = [];
				} else {
					notes[document.getElementsByClassName('discipline')[x - 1].firstChild.firstChild.innerHTML][0] = [];
				}
			} else { // créer un nouveau dossier pour la matière
				notes[document.getElementsByClassName('discipline')[x].firstChild.firstChild.innerHTML] = [];
			}
		}

		len = document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children.length; // nombre de notes

		effectif = total = 0;
		for (i = 0; i < len; i++) { // pour chaque note
			numerateur = document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children[i].children[(0)].innerText.split("/")[0].replaceAll(",", ".");
			denominateur = (document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children[i].children[(0)].innerText.split("/")[1] || "20").replaceAll(",", ".").split("(")[0];
			result = Number(numerateur) / Number(denominateur); // obtenir une note

			if (String(result) != "NaN") { // ajouter la note au fichier
				total += result;
				effectif++;

				// GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
				l++;
				date = document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children[i].title.split(" - ");
				date = date[date.length - 1].split(" ");
				date = Number(date[date.length - 2]) + Number(date[date.length - 1].replace("septembre", 0).replace("octobre", 30).replace("novembre", 61).replace("decembre", 91).replace("janvier", 122).replace("février", 152).replace("mars", 181.5).replace("avril", 212.5).replace("mai", 242.5).replace("juin", 273.5).replace("juillet", 303.5).replace("aout", 334.5));
				everynotes[date + ":" + l] = result;
				// GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
			}
			firstnote = i;
		}
		// créer les moyennes
		average = total / effectif;
		if (String(average) != "NaN") {
			
			if (document.getElementsByClassName('discipline')[x].classList.contains("sousmatiere")) { // vérifier l'emplacement de la note

				if (document.getElementsByClassName('discipline')[x - 1].classList.contains("sousmatiere")) {
					notes[document.getElementsByClassName('discipline')[x - 2].firstChild.firstChild.innerHTML][1] = average;
				} else {
					notes[document.getElementsByClassName('discipline')[x - 1].firstChild.firstChild.innerHTML][0] = average;
				}
				
				sousmatiere = true;
			} else { // créer un nouveau dossier pour la matière
				notes[document.getElementsByClassName('discipline')[x].firstChild.firstChild.innerHTML] = average;
				sousmatiere = false;
			}

			
			// afficher les moyennes
			if (sousmatiere) {
				document.getElementsByClassName('discipline')[x].parentElement.children[ConstMoyennePos].innerHTML = "( " + Math.round(average * 20 * 1000) / 1000 + " /20 )";
			} else {
				document.getElementsByClassName('discipline')[x].parentElement.children[ConstMoyennePos].innerHTML = Math.round(average * 20 * 1000) / 1000 + " /20";
			}
		}
	}

	// moyenne pour les matières contenant des sous matières
	for (x = 1; x < document.getElementsByClassName('discipline').length - 1; x++) { // pour toutes les matières

		if (!document.getElementsByClassName('discipline')[x].parentElement.children[0].classList.contains("sousmatiere")) { // si ce n'est pas une sous matiere

			if (document.getElementsByClassName('discipline')[x + 1].parentElement.children[0].classList.contains("sousmatiere")) { // vérifie si la 1e cases après appartient à cette matière

				if (document.getElementsByClassName('discipline')[x + 2].parentElement.children[0].classList.contains("sousmatiere")) { // vérifie si la 2e cases après appartient à cette matière
					MatiereAverage = ((Number(document.getElementsByClassName('discipline')[x + 1].parentElement.children[ConstMoyennePos].innerText.replace("( ", "").replace("/20 )", "")) || 0) + Number(document.getElementsByClassName('discipline')[x + 2].parentElement.children[ConstMoyennePos].innerText.replace("( ", "").replace("/20 )", "")) || 0) / 2;

				} else {
					MatiereAverage = Number(document.getElementsByClassName('discipline')[x + 1].parentElement.children[ConstMoyennePos].innerText.replace("( ", "").replace("/20 )", ""));
					
				}
				// affiche la moyenne trouvé.
				document.getElementsByClassName('discipline')[x].parentElement.children[ConstMoyennePos].innerHTML = MatiereAverage + " /20";
			}
		}
	}

	

	// moyenne globale
	total = 0;
	effectif = 0;
	let inputNumber = 0;
	for (i = 0; i < Object.values(notes).length; i++) {
		if (Object.values(notes)[i].length == undefined) { // si c'est une matière clasique

			total += (Object.values(notes)[i])*parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
			effectif += parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
			inputNumber++;
		} else if (typeof (Object.values(Object.values(notes)[i])[0]) == "number" || typeof (Object.values(Object.values(notes)[i])[1]) == "number") { // si une sous matière a une note
			
			if (typeof(Object.values(Object.values(notes)[i])[0]) == "number" &&typeof(Object.values(Object.values(notes)[i])[1]) == "number") { // si les deux sous matières ont une note
				qutnt = 2;
			} else { // sinon seulement si une seule sous matiere a des notes
				qutnt = 1;
			}
			total += (((Object.values(Object.values(notes)[i])[0] || 0) + (Object.values(Object.values(notes)[i])[1] || 0)) / qutnt)*parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
			effectif += parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
			inputNumber++;
		}
	}
	GlobalAverage = (total / effectif) * 20;
	display(GlobalAverage);


	// GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
	// tableau to list
	arr = [];
	for (var key in everynotes) {
		if (everynotes.hasOwnProperty(key)) {
			arr.push( [ key, everynotes[key] ] );
		}
	}
	arr.sort();

	datapoints = [];
	datapoints2 = [];
	datapoints3 = [];

	// double tableau to simple tableau
	for (i = 0; i < arr.length; i++) {
		datapoints.push(arr[i][1] * 20); // notes
		if (i == 0) datapoints2.push(arr[0][1] * 20); // évolution de la moyenne 
		datapoints2.push(((datapoints2[datapoints2.length - 1] * datapoints2.length) + (arr[i][1] * 20)) / (datapoints2.length +1));
		if (i == 0) datapoints2.shift();
		datapoints3.push(GlobalAverage); // const average
	}
	
	// create chart
	labels = [];
	for (let i = 0; i < datapoints.length; ++i) {
		labels.push(i.toString());
	}
	
	radius = 4;
	tension = 0.2;
	massPopChart = new Chart(document.getElementById("graphic").getContext('2d'), {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'Notes ce trimestre',
				data: datapoints,
				borderColor: "#000",
				tension: tension,
				pointRadius: radius,
			},{
				label: 'Evolution de la moyenne (non pondéré par matières), écart de ' + Math.round(Math.sqrt((datapoints2[datapoints2.length -1] - GlobalAverage) ** 2) * 1000) / 1000 + ' avec la moyenne générale', // nombre positif d'écart entre la moyenne pondéré et non pondéré par matiere
				data: datapoints2,
				borderColor: "#F00",
				tension: tension,
				pointRadius: radius,
			},{
				label: 'Moyenne générale', // moyenne générale
				data: datapoints3,
				borderColor: "#00F",
				tension: tension,
				pointRadius: 0,
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: 'Evolution de tes notes ce trimestre',
				},
			},
			scales: {
				y: {
					suggestedMax: 20,
				}
			}
		},
	});
	// GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
}

function getMoyenneWME() {

    // calculates and displays the general average of the student's grades.
    total = 0;
	effectif = 0;
	let inputNumber = 0;
	for (i = document.getElementsByClassName("relevemoyenne").length - 1; i >= 0; i--) {
		note = Number(document.getElementsByClassName("relevemoyenne")[i].innerText.replace(",", "."))*$$("input.coef")[inputNumber].value;
		if (note == note && document.getElementsByClassName("relevemoyenne")[i].innerText != "") {
			total += note;
			effectif += $$("input.coef")[inputNumber].value;
			inputNumber++;
		}
	}
	GlobalAverage = total / effectif;
	display(GlobalAverage);

    notes = {};
	everynotes = {};
	l = 0;
    
    // determiner constEvalPos => positions du tableau des notes
    x = 0;
    while (document.getElementsByClassName('discipline')[0].parentElement.children[x]) {
        if (document.getElementsByClassName('discipline')[0].parentElement.children[x].innerText == "EVALUATIONS") {
            constEvalPos = x;
            break;
        }
        x++;
    }
    
	
	for (x = 1; x < document.getElementsByClassName('discipline').length; x++) { // pour toutes les matières
		// créer le tableau
		if (notes[document.getElementsByClassName('discipline')[x].firstChild.firstChild.innerHTML] == undefined) {
			if (document.getElementsByClassName('discipline')[x].classList.contains("sousmatiere")) { // créer un nouveau dossier pour la sous matière
				if (document.getElementsByClassName('discipline')[x - 1].classList.contains("sousmatiere")) { // sous matiere avant elle
					notes[document.getElementsByClassName('discipline')[x - 2].firstChild.firstChild.innerHTML][1] = [];
				} else {
					notes[document.getElementsByClassName('discipline')[x - 1].firstChild.firstChild.innerHTML][0] = [];
				}
			} else { // créer un nouveau dossier pour la matière
				notes[document.getElementsByClassName('discipline')[x].firstChild.firstChild.innerHTML] = [];
			}
		}

		len = document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children.length; // nombre de notes

		effectif = total = 0;
		for (i = 0; i < len; i++) { // pour chaque note
			numerateur = document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children[i].children[(0)].innerText.split("/")[0].replaceAll(",", ".");
			denominateur = (document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children[i].children[(0)].innerText.split("/")[1] || "20").replaceAll(",", ".").split("(")[0];
			result = Number(numerateur) / Number(denominateur); // obtenir une note

			if (String(result) != "NaN") { // ajouter la note au fichier
				total += result;
				effectif++;

				// GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
				l++;
				date = document.getElementsByClassName('discipline')[x].parentElement.children[constEvalPos].children[i].title.split(" - ");
				date = date[date.length - 1].split(" ");
				date = Number(date[date.length - 2]) + Number(date[date.length - 1].replace("septembre", 0).replace("octobre", 30).replace("novembre", 61).replace("decembre", 91).replace("janvier", 122).replace("février", 152).replace("mars", 181.5).replace("avril", 212.5).replace("mai", 242.5).replace("juin", 273.5).replace("juillet", 303.5).replace("aout", 334.5));
				everynotes[date + ":" + l] = result;
				// GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
			}
			firstnote = i;
		}
    }
    
    // GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
	// tableau to list
	arr = [];
	for (var key in everynotes) {
		if (everynotes.hasOwnProperty(key)) {
			arr.push( [ key, everynotes[key] ] );
		}
	}
	arr.sort();

	datapoints = [];
	datapoints2 = [];
	datapoints3 = [];

	// double tableau to simple tableau
	for (i = 0; i < arr.length; i++) {
		datapoints.push(arr[i][1] * 20); // notes
		if (i == 0) datapoints2.push(arr[0][1] * 20); // évolution de la moyenne
		datapoints2.push(((datapoints2[datapoints2.length - 1] * datapoints2.length) + (arr[i][1] * 20)) / (datapoints2.length +1));
		if (i == 0) datapoints2.shift();
		datapoints3.push(GlobalAverage); // const average
	}
	
	// create chart
	labels = [];
	for (let i = 0; i < datapoints.length; ++i) {
		labels.push(i.toString());
	}
	
	radius = 4;
	tension = 0.2;
	massPopChart = new Chart(document.getElementById("graphic").getContext('2d'), {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'Notes ce trimestre',
				data: datapoints,
				borderColor: "#000",
				tension: tension,
				pointRadius: radius,
			},{
				label: 'Evolution de la moyenne (non pondéré par matières), écart de ' + Math.round(Math.sqrt((datapoints2[datapoints2.length -1] - GlobalAverage) ** 2) * 1000) / 1000 + ' avec la moyenne générale', // nombre positif d'écart entre la moyenne pondéré et non pondéré par matiere
				data: datapoints2,
				borderColor: "#F00",
				tension: tension,
				pointRadius: radius,
			},{
				label: 'Moyenne générale', // moyenne générale
				data: datapoints3,
				borderColor: "#00F",
				tension: tension,
				pointRadius: 0,
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: 'Evolution de tes notes ce trimestre',
				},
			},
			scales: {
				y: {
					suggestedMax: 20,
				}
			}
		},
	});
	// GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS GRAPHICS
}

function display(GlobalAverage) {
	// obtenir le contenue HTML de la page
	if (String(GlobalAverage) == "NaN") {
		averageToDisplay = "<div id=\"averageToDisplay\">aucune note</div>"
	} else {
		GlobalAverage = Math.round(GlobalAverage * 1000) / 1000;
		averageToDisplay = "<div id=\"averageToDisplay\">Moyenne générale: " + GlobalAverage + " /20</div>";
	}
	
	document.getElementById("encart-notes").getElementsByTagName("div")[0].innerHTML = "<a id=\"div\" target=\"_blank\" href=\"https://github.com/sklbz\"><svg aria-hidden=\"true\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"32\" data-view-component=\"true\"><path fill-rule=\"evenodd\" d=\"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z\"></path></svg></a>" + averageToDisplay;
}

async function init() {
	while (document.getElementsByTagName("table")[0] == undefined) { // attendre de chargment du tableau
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	// supprimer les noms des professeurs 
	let iMax = document.querySelectorAll('.professeur').length;
	for (let i = 0; i < iMax; i++){
		document.querySelectorAll('.professeur')[0].remove();
	}

	// affichage du chargement
	document.getElementById("encart-notes").getElementsByTagName("div")[0].innerHTML = "<a id=\"div\" target=\"_blank\" href=\"https://github.com/sklbz\"><svg style='animation: load infinite 1s;' aria-hidden=\"true\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"32\" data-view-component=\"true\"><path fill-rule=\"evenodd\" d=\"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z\"></path></svg></a>";

	// fonctions initials
	await new Promise(resolve => setTimeout(resolve, 2000));
    
    // si il y a deja une colonne moyenne
    displayAverage = 0;
    for (i = document.getElementById("encart-notes").getElementsByTagName("table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th").length - 1; i >= 0; i--) { 
        if (document.getElementById("encart-notes").getElementsByTagName("table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[i].innerText.toLowerCase() == "moyennes") {
            // verifier que au moins une moyenne contient un nombre
            total = 0;
            for (i = document.getElementsByClassName("relevemoyenne").length - 1; i >= 0; i--) {
                note = Number(document.getElementsByClassName("relevemoyenne")[i].innerText.replace(",", "."));
                if (note == note && document.getElementsByClassName("relevemoyenne")[i].innerText != "") {
                    total += note;
                }
            }
            if (total != 0) {
                displayAverage = 1;
            } else {
                displayAverage = 2;
            }
        }
    }
    
    if (displayAverage == 0) {
        column(true);
        getMoyenne();
    } else if (displayAverage == 1) {
        column(false);
        getMoyenneWME();  
    } else if (displayAverage == 2) {
        column(false);
        getMoyenne();
    }
    
	return true;
}



async function detection() {
	if (window.location.origin == "https://www.ecoledirecte.com" && returnNewDetection == true) {
		returnNewDetection = false
		while (window.location.origin == "https://www.ecoledirecte.com" && !window.location.href.includes("Notes")) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		if (window.location.origin == "https://www.ecoledirecte.com" && window.location.href.includes("Notes") && document.getElementById("averageToDisplay") == undefined) {
			init();
			returnNewDetection = true;
		} else {
			returnNewDetection = true;
		}
	}
}
returnNewDetection = true
detection();

addEventListener('click', (event) => {
	detection();
	// moyenne globale
	total = 0;
	effectif = 0;
	let inputNumber = 0;
	for (i = 0; i < Object.values(notes).length; i++) {
		if (Object.values(notes)[i].length == undefined) { // si c'est une matière clasique

			total += (Object.values(notes)[i])*parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
			effectif += parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
			inputNumber++;
		} else if (typeof (Object.values(Object.values(notes)[i])[0]) == "number" || typeof (Object.values(Object.values(notes)[i])[1]) == "number") { // si une sous matière a une note
			
			if (typeof(Object.values(Object.values(notes)[i])[0]) == "number" &&typeof(Object.values(Object.values(notes)[i])[1]) == "number") { // si les deux sous matières ont une note
				qutnt = 2;
			} else { // sinon seulement si une seule sous matiere a des notes
				qutnt = 1;
			}
			total += (((Object.values(Object.values(notes)[i])[0] || 0) + (Object.values(Object.values(notes)[i])[1] || 0)) / qutnt)*parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
			effectif += parseFloat(document.querySelectorAll("input.coef")[inputNumber].value);
		}
	}
	GlobalAverage = (total / effectif) * 20;
	display(GlobalAverage);
});
