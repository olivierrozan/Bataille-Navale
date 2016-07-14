var isEnded;
var nb;
var numberOfRows;
var numberOfBoatsPerPlayer;
var isCPUBoatSunk;
var isPlayerBoatSunk;
var target;
var timer;
var placetmp = 0;
var chanceOfHittingBoat = 50;

var isPlayerPlaying = true;

/**
 * checkWinner
 * Vérifie qui a gagné
**/
function checkWinner()
{
	// Si le Joueur perd
	if($('.player .boom').length == numberOfBoatsPerPlayer) {
		$(".logTitle").text("YOU LOSE !");
		$(".ia .boat:not(.boom)").css("background", "black");
		
		$(".playerBoatsRemaining").text("PLAYER *LOSES* (" + $(".ia .boom").length + " Pts)").css("color", "red");
		$(".PlayerSink").css("color", "red");
		$(".CPUBoatsRemaining").text("CPU *WINS* (" + $(".player .boom").length + " Pts)").css("color", "green");
		$(".CPUSink").css("color", "green");
		
		isEnded = true;		
	}
	
	// Si le Joueur gagne
	if($('.ia .boom').length == numberOfBoatsPerPlayer) {
		$(".logTitle").text("YOU WIN !");
		
		$(".playerBoatsRemaining").text("PLAYER *WINS* (" + $(".ia .boom").length + " Pts)").css("color", "green");
		$(".PlayerSink").css("color", "green");
		$(".CPUBoatsRemaining").text("CPU *LOSES* (" + $(".player .boom").length + " Pts)").css("color", "red");
		$(".CPUSink").css("color", "red");
		
		isEnded = true;
	}
	
	if (isEnded) {
		countdown();
		
		setTimeout(function () { window.location = "index.html" }, 5000);
	}
}

function countdown()
{
	$(".redirect").text("New Game in " + timer + "...");
	timer--;
	
	setTimeout(countdown, 1000);
}

/**
 * CPUAimsAtPlayer
 * Le CPU joue (vise le joueur)
**/
function CPUAimsAtPlayer()
{
	var posx = Math.round(Math.random() * (numberOfRows - 1));
	var posy = Math.round(Math.random() * (numberOfRows - 1));
	
	var $td = $('.player .line-' + posy + ' .col-' + posx);
	var oneBoatCase = Math.round(Math.random() * 13);
	
	target = Math.round(Math.random() * 100);
		
	if (target <= chanceOfHittingBoat) {
		if ($(".player .boat[ind='" + oneBoatCase + "']").hasClass('plouf') || $(".player .boat[ind='" + oneBoatCase + "']").hasClass('boom')) {		
			return CPUAimsAtPlayer();
		}
		else {					
			checkHit($(".player .boat[ind='" + oneBoatCase + "']"), "CPU ", ".CPULog");
			return CPUAimsAtPlayer();
		}
	} else {
		if ($td.hasClass('plouf') || $td.hasClass('boom')) {	
			return CPUAimsAtPlayer();
		}
		else {					
			checkHit($td, "CPU ", ".CPULog");			
		}
	}
	
	//$(".CPUBoatsRemaining").text("CPU " + $(".player .boom").length);
	
	checkWinner();
}

/**
 * log
 * Ajout d'une ligne de texte dans le journal d'evenements
**/
function log(text, balise)
{
	$(balise).html(text);
}

/**
 * checkHit
 * Vérifie si la case visée contient un bateau ou non
**/
function checkHit(td, string, balise)
{
	if (td.hasClass('boat')) {
		log(string + " at " + td.attr("coord") + " : <span style='color:blue;'>HIT</span><br>", balise);
		td.addClass('boom');
	}
	else {
		log(string + " at " + td.attr("coord") + " : <span style='color:red;'>MISSED</span><br>", balise);
		td.addClass('plouf');
		isPlayerPlaying = !isPlayerPlaying;
		$("h1").text(isPlayerPlaying);
	}	
}

/**
 * checkSunk
 * Vérifie si un bateau est coulé ou non
**/
function checkSunk(nb)
{
	if ($(".player .boat" + nb + ".boom").length === nb) {
		//$(".playerBoatsRemaining").append("<nav>" + nb + " Player coule</nav>");
		isPlayerBoatSunk[nb-2] = true;
	}
	
	if ($(".ia .boat" + nb + ".boom").length === nb) {
		//$(".CPUBoatsRemaining").append("<nav>" + nb + " CPU coule</nav>");
		isCPUBoatSunk[nb-2] = true;
	}
}

/**
 * PlayerAimsAtCpu
 * Le joueur joue (vise le CPU)
**/
function PlayerAimsAtCpu()
{	
	if (!isEnded) {	
		if ($(this).hasClass("plouf") || $(this).hasClass("boom")) {			
			return;
		} else {
			if ($('.player .boat').length == numberOfBoatsPerPlayer) {			
				checkHit($(this), "Player ", ".playerLog");
				/*setTimeout(function () { $(".ia td").off('click'); }, 1);
				setTimeout(CPUAimsAtPlayer, 200);
				setTimeout(function () { $(".ia td").on('click', PlayerAimsAtCpu) }, 200);*/
				if (!isPlayerPlaying) {
					CPUAimsAtPlayer();
				}
				
			}
		}
		
		checkSunk(5);
		checkSunk(4);
		checkSunk(3);
		checkSunk(2);	
		
		for (var i = 0; i < 4; i++) {
			if (isCPUBoatSunk[i]) {
				$(".CPUSink[boat='" + (i + 2) + "']").css("visibility", "visible");
				$(".ia .boat" + (i + 2) + ".boom").css("background", "green");
			}
			
			if (isPlayerBoatSunk[i]) {
				$(".PlayerSink[boat='" + (i + 2) + "']").css("visibility", "visible");
				$(".player .boat" + (i + 2) + ".boom").css("background", "green");
			}
		}
		
		//$(".playerBoatsRemaining").text("PLAYER " + $(".ia .boom").length);
	}
}

/**
 * calculCoordIABoatV
 * place les bateaux é la verticale dans le tableau du joueur
 * sans qu'ils ne dépassent le tableau
 * et sans que les bateaux ne se chevauchent
**/
var calculCoordIABoatV = function (numberOfCells, numberOfRows)
{
	var posx = Math.round(Math.random() * (numberOfRows - 1));
	var posy = Math.round(Math.random() * (numberOfCells - 1));
		
	if (!$('.ia .line-' + posy + ' .col-' + posx).hasClass("boat") &&
	!$('.ia .line-' + (posy+1) + ' .col-' + posx).hasClass("boat") &&
	!$('.ia .line-' + (posy+2) + ' .col-' + posx).hasClass("boat") &&
	!$('.ia .line-' + (posy+3) + ' .col-' + posx).hasClass("boat") &&
	!$('.ia .line-' + (posy+4) + ' .col-' + posx).hasClass("boat")
	) {
		return {
			retour: true,
			posx: posx,
			posy: posy
		};
	} else {
		return calculCoordIABoatV(numberOfCells, numberOfRows);
	}
}

/**
 * calculCoordIABoatH
 * place les bateaux é l'horizontale dans le tableau du joueur
 * sans qu'ils ne dépassent le tableau
 * et sans que les bateaux ne se chevauchent
**/
var calculCoordIABoatH = function (numberOfCells, numberOfRows)
{
	var posx = Math.round(Math.random() * (numberOfCells - 1));
	var posy = Math.round(Math.random() * (numberOfRows - 1));
		
	if (!$('.ia .line-' + posy + ' .col-' + posx).hasClass("boat") &&
	!$('.ia .line-' + posy + ' .col-' + (posx+1)).hasClass("boat") &&
	!$('.ia .line-' + posy + ' .col-' + (posx+2)).hasClass("boat") &&
	!$('.ia .line-' + posy + ' .col-' + (posx+3)).hasClass("boat") &&
	!$('.ia .line-' + posy + ' .col-' + (posx+4)).hasClass("boat")
	) {
		return {
			retour: true,
			posx: posx,
			posy: posy
		};
	} else {
		return calculCoordIABoatH(numberOfCells, numberOfRows);
	}
}

/**
 * addBoatsCPU
 * Ajout des bateaux dans le tableau du CPU
**/
function addBoatsCPU(numberOfCells)
{
	var isHorizontal = Math.round(Math.random());
			
	// Horizontal
	if (isHorizontal == 0) {
		var coordX = calculCoordIABoatH(numberOfCells, numberOfRows); 
		
		if (coordX.retour) {
			for (var i = 0; i < numberOfCells; i++) {
				$('.ia .line-' + coordX.posy + ' .col-' + (coordX.posx+i)).addClass('boat').addClass('boat'+numberOfCells);
			}
		}
	} 
	// Vertical
	else {
		var coordY = calculCoordIABoatV(numberOfCells, numberOfRows); 
		
		if (coordY.retour) {
			for (var i = 0; i < numberOfCells; i++) {
				$('.ia .line-' + (coordY.posy+i) + ' .col-' + coordY.posx).addClass('boat').addClass('boat'+numberOfCells);
			}
		}
	}
}

/**
 * addAllCPUBoats
 * Ajout des bateaux dans le tableau du CPU
**/
function addAllCPUBoats()
{
	if ($(".player .boat").length == numberOfBoatsPerPlayer) {
		
		$('.player td').off('click');
		$(".logTitle").text("PLAY !");
		
		// Ajout des bateaux du CPU
		
		addBoatsCPU(5);
		addBoatsCPU(4);
		addBoatsCPU(3);
		addBoatsCPU(2);
		
		$(".playerBoatsRemaining").text("PLAYER "/* + $(".ia .boom").length*/);
		$(".CPUBoatsRemaining").text("CPU "/* + $(".player .boom").length*/);
	}
}

/**
 * placeBoats
 * Ajout un bateau dans le tableau du CPU
**/
function placeBoat(label, posX, posY, nbCases)
{
	var isHorizontal = true;
	
	$(label).on("dblclick", function () {
		var h = $(this).height();
		var w = $(this).width();
				
		$(this).width(h);
		$(this).height(w);	
		
		isHorizontal = !isHorizontal;
	});
	
	$("#play").on("click", function () {
		var xtmp = (($(label).position().top - posY) / 33);
		var x = String.fromCharCode(xtmp + 65);
		var y = (($(label).position().left - posX) / 33) + 1;
		
		for (var i = 0; i < nbCases; i++) {
			if (isHorizontal) {
				var y = (($(label).position().left - posX) / 33) + 1 + i;
			} else {
				var x = String.fromCharCode(xtmp + 65 + i);				
			}	
			
			$(".player td[coord=" + x + y + "]").addClass("boat").addClass("boat" + nbCases);
		}
		
		$(label).remove();
		
		addAllCPUBoats();
		
		$(this).css("display", "none");
	});
}

function coordTables()
{
	$('.grid').append('<ul id="tableCol1"></ul>');
	$('.grid').append('<ul id="tableCol2"></ul>');
	
	for (var i = 1; i < 11; i++) {
		$("#tableCol1, #tableCol2").append("<li>" + i + "</li>");
	}
	
	$('.grid').append('<ul id="tableRow1"></ul>');
	$('.grid').append('<ul id="tableRow2"></ul>');
	
	for (var i = 1; i < 11; i++) {
		$("#tableRow1, #tableRow2").append("<li>" + String.fromCharCode(i + 64) + "</li>");
	}
}

/**
 * init
 * Création des tableaux
**/
function init()
{
	isEnded = false;
	nb = 1;
	numberOfRows = 10;
	numberOfBoatsPerPlayer = 14;
	isCPUBoatSunk = [false, false, false, false];
	isPlayerBoatSunk = [false, false, false, false];
	target = 0;
	timer = 5;
	
	// Création des tableaux
	$(".logTitle").text("Player : Prepare your fleet");
	
	coordTables();
	
	$('.grid').append('<table class="board ia"></table><br><br>');
	$('.grid').append('<table class="board player"></table>');
	
	var $table = $('.board');
	
	for (var i = 0 ; i < numberOfRows ; i++) {
		$table.append('<tr class="line line-'+i+'">'+i+'</tr>');
		var $line = $('.line-'+i);
		
		for (var j = 0 ; j < numberOfRows ; j++) {
			$line.append('<td class="col col-' + j + '" coord="' + String.fromCharCode(i + 65) + (j + 1) + '"></td>');
		}
	}
}

/**
 * placeAllPlayersBoats
 * Place tous les bateaux du joueur
**/
function placeAllPlayersBoats () 
{
	placeBoat("#five", 320, 422, 5);
	placeBoat("#four", 320, 422, 4);
	placeBoat("#three", 320, 422, 3);
	placeBoat("#two", 320, 422, 2);
}

$(document).ready(function() {
	init();
	
	$(".player td:not('boat')").on("click", function () {
		// debut
		if (placetmp == 0) {
			placetmp = 1;
			
			$(this).addClass("boat boat5");
			
			$(this).next().on("mouseover", function () {
				if (placetmp == 1) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					$(this).next().addClass("placetmp");
					$(this).next().next().addClass("placetmp");
					$(this).next().next().next().addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						
						placetmp = 2;
						$(".placetmp").addClass("boat boat5").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).next().on("mouseout", function () {
				$(this).removeClass("placetmp");
				$(this).next().removeClass("placetmp");
				$(this).next().next().removeClass("placetmp");
				$(this).next().next().next().removeClass("placetmp");
			});*/
			
			$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseover", function () {
				if (placetmp == 1) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					$(this).parent().next().children("td:eq(" + $(this).index() + ")").addClass("placetmp");
					$(this).parent().next().next().children("td:eq(" + $(this).index() + ")").addClass("placetmp");
					$(this).parent().next().next().next().children("td:eq(" + $(this).index() + ")").addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						placetmp = 2;
						$(".placetmp").addClass("boat boat5").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseout", function () {
				$(this).removeClass("placetmp");
				$(this).parent().next().children("td:eq(" + $(this).index() + ")").removeClass("placetmp");
				$(this).parent().next().next().children("td:eq(" + $(this).index() + ")").removeClass("placetmp");
				$(this).parent().next().next().next().children("td:eq(" + $(this).index() + ")").removeClass("placetmp");
			});*/
		}
		// fin
		
		// debut
		if (placetmp == 2) {
			placetmp = 3;
			
			$(this).addClass("boat boat4");
			
			$(this).next().on("mouseover", function () {
				if (placetmp == 3) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					$(this).next().addClass("placetmp");
					$(this).next().next().addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						
						placetmp = 4;
						$(".placetmp").addClass("boat boat4").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).next().on("mouseout", function () {
				$(this).removeClass("placetmp");
				$(this).next().removeClass("placetmp");
				$(this).next().next().removeClass("placetmp");
			});*/
			
			$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseover", function () {
				if (placetmp == 3) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					$(this).parent().next().children("td:eq(" + $(this).index() + ")").addClass("placetmp");
					$(this).parent().next().next().children("td:eq(" + $(this).index() + ")").addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						placetmp = 4;
						$(".placetmp").addClass("boat boat4").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseout", function () {
				$(this).removeClass("placetmp");
				$(this).parent().next().children("td:eq(" + $(this).index() + ")").removeClass("placetmp");
				$(this).parent().next().next().children("td:eq(" + $(this).index() + ")").removeClass("placetmp");
			});*/
		}
		// fin
		
		// debut
		if (placetmp == 4) {
			placetmp = 5;
			
			$(this).addClass("boat boat3");
			
			$(this).next().on("mouseover", function () {
				if (placetmp == 5) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					$(this).next().addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						
						placetmp = 6;
						$(".placetmp").addClass("boat boat3").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).next().on("mouseout", function () {
				$(this).removeClass("placetmp");
				$(this).next().removeClass("placetmp");
			});*/
			
			$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseover", function () {
				if (placetmp == 5) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					$(this).parent().next().children("td:eq(" + $(this).index() + ")").addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						placetmp = 6;
						$(".placetmp").addClass("boat boat3").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseout", function () {
				$(this).removeClass("placetmp");
				$(this).parent().next().children("td:eq(" + $(this).index() + ")").removeClass("placetmp");
			});*/
		}
		// fin
		
		// debut
		if (placetmp == 6) {
			placetmp = 7;
			
			$(this).addClass("boat boat2");
			
			$(this).next().on("mouseover", function () {
				if (placetmp == 7) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						placetmp = 8;
						$(".placetmp").addClass("boat boat2").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).next().on("mouseout", function () {
				$(this).removeClass("placetmp");
			});*/
			
			$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseover", function () {
				if (placetmp == 7) {
					$("td").removeClass("placetmp");
					
					$(this).addClass("placetmp");
					
					$(".placetmp").on("click", function () {
						placetmp = 8;
						$(".placetmp").addClass("boat boat2").removeClass("placetmp");
					});
				}
			});
			
			/*$(this).parent().next().children("td:eq(" + $(this).index() + ")").on("mouseout", function () {
				$(this).removeClass("placetmp");
			});*/
		}
		// fin
	});
	
	//placeAllPlayersBoats();
	
	
	$("#play").on("click", function () {
		if (placetmp == 8) {
			
			$(this).remove();
		
			addAllCPUBoats();
			
			$(this).css("display", "none");
			
			$(".player .boat").each(function (index) {
				$(this).attr("ind", index);
			});
		}
	});
	
	// Le joueur cherche les bateaux ennemis
	$('.ia td').on('click', PlayerAimsAtCpu);
});