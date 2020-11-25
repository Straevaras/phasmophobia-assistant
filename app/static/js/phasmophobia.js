const GAME_VERSION = "0.176.39"
var DEBUG = false

const GHOST_BANSHEE = "Banshee"
const GHOST_DEMON = "Demon"
const GHOST_JINN = "Jinn"
const GHOST_MARE = "Mare"
const GHOST_ONI = "Oni"
const GHOST_PHANTOM = "Phantom"
const GHOST_POLTERGEIST = "Poltergeist"
const GHOST_REVENANT = "Revenant"
const GHOST_SHADE = "Shade"
const GHOST_SPIRIT = "Spirit"
const GHOST_WRAITH = "Wraith"
const GHOST_YUREI = "Yurei"

const EVIDENCE_EMF = "EMF Level 5"
const EVIDENCE_FINGERPRINTS = "Fingerprints"
const EVIDENCE_FREEZING = "Freezing Temperatures"
const EVIDENCE_ORB = "Ghost Orb"
const EVIDENCE_WRITING = "Ghost Writing"
const EVIDENCE_BOX = "Spirit Box"

const LOCATIONS = [
	"Tanglewood Streethouse",
	"Edgefield Street House",
	"Ridgeview Road House",
	"Grafton Farmhouse",
	"Bleadsdale Farmhouse",
	"Brownstone High School",
	"Asylum"
]

const DIFFICULTIES = [
	"Amateur",
	"Intermediate",
	"Professional"
]

const NAMES_FIRST = [
	"Barbara",
	"Carol",
	"Christopher",
	"Daniel",
	"David",
	"Donald",
	"Donna",
	"Dorothy",
	"George",
	"Helen",
	"James",
	"John",
	"Kenneth",
	"Jennifer",
	"Linda",
	"Lisa",
	"Mark",
	"Mary",
	"Michael",
	"Patricia",
	"Paul",
	"Richard",
	"Robert",
	"Ruth",
	"Sandra",
	"Steven",
	"Susan",
	"Thomas",
	"William"
]

const NAMES_LAST = [
	"Anderson",
	"Brown",
	"Clark",
	"Davis",
	"Harris",
	"Jackson",
	"Johnson",
	"Jones",
	"Martinez",
	"Miller",
	"Moore",
	"Robinson",
	"Taylor",
	"Thomas",
	"Thompson",
	"White",
	"Williams",
	"Wilson",
]

const OBJECTIVE_MAIN = "Discover what type of Ghost we are dealing with"
const OBJECTIVE_BONUS = [
	"Capture a photo of Dirty Water in a sink",
	"Capture a photo of the Ghost",
	"Cleanse the area near the Ghost using Smudge Sticks",
	"Detect a room below 10 Celsius/50 Fahrenheit with a Thermometer",
	"Detect a Ghosts presence with a Motion Sensor",
	"Find evidence of the paranormal with an EMF Reader",
	"Get a Ghost to walk through Salt",
	"Have a member of your team witness a Ghost Event",
	"Prevent the Ghost from hunting with a Crucifix"
]

const REPORTS = [
	"Gonna be a tough one.",
	"Left in a hurry / Possible Ghost sighting.",
	"Reports of Light Switching / No Reports of Violence or Sightings.",
	"No Reports of Violence, Going in Blind, Nothing Else to Report.",
]

const EVIDENCE_ABBR = {
	"emf": EVIDENCE_EMF,
	"fingerprints": EVIDENCE_FINGERPRINTS,
	"freezing": EVIDENCE_FREEZING,
	"orb": EVIDENCE_ORB,
	"writing": EVIDENCE_WRITING,
	"box": EVIDENCE_BOX
}

var ghostEvidence = {}
ghostEvidence[GHOST_BANSHEE] 	 = new Set([EVIDENCE_EMF,			EVIDENCE_FINGERPRINTS,	EVIDENCE_FREEZING	])
ghostEvidence[GHOST_DEMON]	 	 = new Set([EVIDENCE_FREEZING,		EVIDENCE_WRITING,		EVIDENCE_BOX		])
ghostEvidence[GHOST_JINN]		 = new Set([EVIDENCE_EMF,			EVIDENCE_ORB,			EVIDENCE_BOX		])
ghostEvidence[GHOST_MARE]		 = new Set([EVIDENCE_FREEZING,		EVIDENCE_ORB,			EVIDENCE_BOX		])
ghostEvidence[GHOST_ONI]		 = new Set([EVIDENCE_EMF, 			EVIDENCE_WRITING,		EVIDENCE_BOX		])
ghostEvidence[GHOST_PHANTOM]	 = new Set([EVIDENCE_EMF,			EVIDENCE_FREEZING,		EVIDENCE_ORB		])
ghostEvidence[GHOST_POLTERGEIST] = new Set([EVIDENCE_FINGERPRINTS,	EVIDENCE_ORB,			EVIDENCE_BOX		])
ghostEvidence[GHOST_REVENANT]	 = new Set([EVIDENCE_EMF,			EVIDENCE_FINGERPRINTS,	EVIDENCE_WRITING	])
ghostEvidence[GHOST_SHADE]		 = new Set([EVIDENCE_EMF,			EVIDENCE_ORB,			EVIDENCE_WRITING	])
ghostEvidence[GHOST_SPIRIT]		 = new Set([EVIDENCE_FINGERPRINTS,	EVIDENCE_WRITING,		EVIDENCE_BOX		])
ghostEvidence[GHOST_WRAITH]		 = new Set([EVIDENCE_FINGERPRINTS,	EVIDENCE_FREEZING,		EVIDENCE_BOX		])
ghostEvidence[GHOST_YUREI]		 = new Set([EVIDENCE_FREEZING,		EVIDENCE_ORB,			EVIDENCE_WRITING	])

var evidenceObserved = new Set()
var evidenceRuledOut = new Set()

function checkGhost(ghostType) {
	// -1:no, 0:maybe, 1:yes
	
	// Check for any ruled out evidence that matches the ghost
	if (ghostEvidence[ghostType].intersection(evidenceRuledOut).size > 0) {
		return -1
	}
	// Check if there's any observed evidence that doesn't match the ghost
	else if (!evidenceObserved.subSet(ghostEvidence[ghostType])) {
		return -1
	}
	// Check if we've observed all evidence for a ghost
	else if (evidenceObserved.size == 3 && ghostEvidence[ghostType].union(evidenceObserved).size == 3)
		return 1
	else
		return 0
}

function updateAllGhosts() {
	var ghostArray = Object.keys(ghostEvidence)
	ghostArray.forEach(function(ghostType) {
		ghostStatus = checkGhost(ghostType)
		if (ghostStatus == 1) {
			$("#ghost_{0}".format(ghostType.toLowerCase()))
				.removeClass("btn-light btn-danger")
				.addClass("btn-success")
		}
		else if (ghostStatus == -1) {
			$("#ghost_{0}".format(ghostType.toLowerCase()))
				.removeClass("btn-light btn-success")
				.addClass("btn-danger")
		}
		else {
			$("#ghost_{0}".format(ghostType.toLowerCase()))
				.removeClass("btn-success btn-danger")
				.addClass("btn-light")
		}
	});
	updateAllEvidence()
}

function updateAllEvidence() {
	// Get a set of all possible evidence based on possible ghosts
	var possibleEvidence = new Set()
	$("[id^=ghost_]").not(".btn-danger").each(function() {
		possibleEvidence = ghostEvidence[$(this).text()].union(possibleEvidence)
	});
	
	// Go over each evidence point and change controls accordingly
	elementsEvidence = $("[id$=_display]")
	elementsEvidence.each(function() {
		// If evidence is green or red skip the check
		if (!$(this).is(".btn-success, .btn-danger")) {		
			evidenceTypeShorthand = $(this).attr("id").split('_')[1]
			evidenceType = EVIDENCE_ABBR[evidenceTypeShorthand]
			if (!possibleEvidence.has(evidenceType)) {
				// Evidence isn't possible, disable controls
				$("#evidence_{0}_ruleout".format(evidenceTypeShorthand)).prop('disabled', true)
				$("#evidence_{0}_observe".format(evidenceTypeShorthand)).prop('disabled', true)
				$("#evidence_{0}_display".format(evidenceTypeShorthand)).removeClass("btn-light").addClass("btn-secondary")
			}
			else {
				// Renable controls in case they were disabled previously
				$("#evidence_{0}_ruleout".format(evidenceTypeShorthand)).prop('disabled', false)
				$("#evidence_{0}_observe".format(evidenceTypeShorthand)).prop('disabled', false)
				$("#evidence_{0}_display".format(evidenceTypeShorthand)).removeClass("btn-secondary").addClass("btn-light")
			}
		}
	});
}

function evidenceToggle() {
	elementId = $(this).attr('id')
	idTokens = elementId.split('_')
	evidenceType = idTokens[1]
	evidenceStatus = idTokens[2]
	
	if (evidenceStatus == 'ruleout') {
		$(this).toggleClass('active')
		if ($(this).hasClass('active')) {
			$("#evidence_{0}_observe".format(evidenceType)).prop('disabled', true)
			$("#evidence_{0}_display".format(evidenceType))
				.removeClass("btn-light")
				.addClass("btn-danger")
			evidenceObserved.delete(EVIDENCE_ABBR[evidenceType])
			evidenceRuledOut.add(EVIDENCE_ABBR[evidenceType])
		}
		else {
			$("#evidence_{0}_observe".format(evidenceType)).prop('disabled', false)
			$("#evidence_{0}_display".format(evidenceType))
				.removeClass("btn-danger")
				.addClass("btn-light")
			evidenceRuledOut.delete(EVIDENCE_ABBR[evidenceType])
		}
	}
	else if (evidenceStatus == 'observe') {
		$(this).toggleClass('active')
		if ($(this).hasClass('active')) {
			$("#evidence_{0}_ruleout".format(evidenceType)).prop('disabled', true)
			$("#evidence_{0}_display".format(evidenceType))
				.removeClass("btn-light")
				.addClass("btn-success")
			evidenceRuledOut.delete(EVIDENCE_ABBR[evidenceType])
			evidenceObserved.add(EVIDENCE_ABBR[evidenceType])
		}
		else {
			$("#evidence_{0}_ruleout".format(evidenceType)).prop('disabled', false)
			$("#evidence_{0}_display".format(evidenceType))
				.removeClass("btn-success")
				.addClass("btn-light")
			evidenceObserved.delete(EVIDENCE_ABBR[evidenceType])
		}
	}
	updateAllGhosts()
}

function objectiveUpdate() {
	objectivesSelected = $("select[id^=objective] option:selected").map(function() {
		return $(this).val()
	}).get()

	// Enable all options then disable what's already selected
	$("select[id^=objective] option").prop('disabled', false)
	for (i = 0; i < objectivesSelected.length; i++) {
		if (objectivesSelected[i] == "")
			continue
		$("select[id^=objective] option:contains('{0}')".format(objectivesSelected[i])).prop('disabled', true)
	}
}

function createCharacteristic(name, id) {
	var optionNAIcon = document.createElement("i")
	$(optionNAIcon).addClass("far fa-question-circle")
	var optionNoIcon = document.createElement("i")
	$(optionNoIcon).addClass("fas fa-times-circle")
	var optionYesIcon = document.createElement("i")
	$(optionYesIcon).addClass("fas fa-check-circle")
	
	var optionNAButton = document.createElement("button")
	$(optionNAButton)
		.attr("id", "char_{0}_na".format(id))
		.addClass("btn btn-secondary btn-sm mr-1")
		.click(toggleCharacteristic)
		.append(optionNAIcon)
	var optionNoButton = document.createElement("button")
	$(optionNoButton)
		.attr("id", "char_{0}_no".format(id))
		.addClass("btn btn-outline-danger btn-sm mr-1")
		.click(toggleCharacteristic)
		.append(optionNoIcon)
	var optionYesButton = document.createElement("button")
	$(optionYesButton)
		.attr("id", "char_{0}_yes".format(id))
		.addClass("btn btn-outline-success btn-sm mr-1")
		.click(toggleCharacteristic)
		.append(optionYesIcon)
	var optionLabelButton = document.createElement("span")
	$(optionLabelButton).addClass("btn btn-light btn-sm btn-block").text(name)
	
	var optionLabelDiv = document.createElement("div")
	$(optionLabelDiv).addClass("col p-0 mr-2 ml-4").append(optionLabelButton)
	var optionButtonDiv = document.createElement("div")
	$(optionButtonDiv)
		.addClass("p-0 mr-3")
		.append(optionNAButton)
		.append(optionNoButton)
		.append(optionYesButton)
	
	var parentDiv = document.createElement("div")
	$(parentDiv).addClass("row mb-1")
		.append(optionLabelDiv)
		.append(optionButtonDiv)
	
	return parentDiv
}

function toggleCharacteristic() {
	var tokens = $(this).attr("id").split("_")
	var charVal = tokens.pop()
	var charId = tokens.join("_")
	
	$("[id^={0}_]".format(charId)).each(function() {
		switch ($(this).attr("id").split("_").pop()) {
			case "na":
				if (charVal == "na") {
					$(this).removeClass("btn-outline-secondary").addClass("btn-secondary")
				}
				else {
					$(this).removeClass("btn-secondary").addClass("btn-outline-secondary")
				}
				break;
			case "no":
				if (charVal == "no") {
					$(this).removeClass("btn-outline-danger").addClass("btn-danger")
				}
				else {
					$(this).removeClass("btn-danger").addClass("btn-outline-danger")
				}
				break;
			case "yes":
				if (charVal == "yes") {
					$(this).removeClass("btn-outline-success").addClass("btn-success")
				}
				else {
					$(this).removeClass("btn-success").addClass("btn-outline-success")
				}
				break;
		}
	});
}

function reset() {
	// Disable reset button until ready
	$("#control_reset").prop('disabled', true)
	
	// Main Info
	$("#main_location").val($("#main_location option:first").val())
	$("#main_difficulty").val($("#main_difficulty option:first").val())
	$("#main_name_first").val($("#main_name_first option:first").val())
	$("#main_name_last").val($("#main_name_last option:first").val())
	$("#main_responds").val($("#main_responds option:first").val())
	$("#main_report").val($("#main_report option:first").val())
		
	// Objective info
	$("select[id^=objective] option").prop('disabled', false)
	$("#objective_2").val($("#objective_2 option:first").val())
	$("#objective_3").val($("#objective_3 option:first").val())
	$("#objective_4").val($("#objective_4 option:first").val())
	
	// Evidence controls
	evidenceObserved.clear()
	evidenceRuledOut.clear()
	$("[id$=_display]").removeClass('btn-danger btn-success btn-secondary').addClass('btn-light')
	$("[id$=_ruleout],[id$=_observe]").removeClass('active').prop('disabled', false)
	
	// Ghost Display
	$("[id^=ghost_]").removeClass('btn-danger btn-success').addClass('btn-light')
	
	// Characteristics
	$("[id^=char_].btn-outline-secondary").removeClass("btn-outline-secondary").addClass("btn-secondary")
	$("[id^=char_].btn-danger").removeClass("btn-danger").addClass("btn-outline-danger")
	$("[id^=char_].btn-success").removeClass("btn-success").addClass("btn-outline-success")
	
	// Remove all error borderStyle
	$("button, select, input").removeClass("border border-warning")
	
	// Reenable reset button
	$("#control_reset").prop('disabled', false)
}

function report() {
	// Verify form data first
	if (!reportVerify()) {
		return
	}
	
	// Disable report button until we get a server response
	$("#control_report").prop('disabled', true)
	
	var objData = {}
	
	// Assemble data
	$("[id^=main_]").each(function() {
		objData[$(this).attr("id")] = $(this).val()
	});
	$("[id^=objective_] option:selected").each(function() {
		objData[$(this).parent().attr("id")] = $(this).val()
	});
	$("[id^=char_]").each(function() {
		var tokens = $(this).attr("id").split("_")
		var charVal = tokens.pop()
		var charId = tokens.join("_")
		
		if (charVal == "na" && $(this).hasClass("btn-secondary")) {
			objData[charId] = "N/A"
		}
		else if (charVal == "no" && $(this).hasClass("btn-danger")) {
			objData[charId] = "No"
		}
		else if (charVal == "yes" && $(this).hasClass("btn-success")) {
			objData[charId] = "Yes"
		}
	});
	
	objData["ghost_type"] = $("[id^=ghost_].btn-success").text()
	
	console.log(objData)
	
	var postData = JSON.stringify(objData)
	
	$.ajax({
		type: 'POST',
		url: '/report',
		data: postData,
		complete: reportSuccess,
		contentType: 'application/json',
		dataType: 'json'
	});
}

function reportSuccess(data, status) {
	console.log({data:data, status:status})
	if (status == "success" && DEBUG != true) {
		reset()
	}
	
	// Reenable report button
	$("#control_report").prop('disabled', false)
}

function reportVerify() {
	// Assume verified until proven otherwise
	verified = true
	
	// Check if all the form data is filled out
	$("[id^=main_],[id^=char_]").each(function() {
		if ($(this).val() == null) {
			$(this).addClass('border border-warning')
			verified = false
		}
		else {
			$(this).removeClass('border border-warning')
		}
	});
	$("[id^=objective_] option:selected").each(function() {
		if ($(this).val() == "") {
			$(this).parent().addClass('border border-warning')
			verified = false
		}
		else {
			$(this).parent().removeClass('border border-warning')
		}
	});
	
	// Check if a ghost is determined
	if ($("[id^=ghost_].btn-success").length != 1) {
		$("[id^=evidence_]:not([id$=_display])").each(function() {
			if ($(this).prop('disabled') == false && !$(this).hasClass('active')) {
				$(this).addClass('border border-warning')
			}
			else {
				$(this).removeClass('border border-warning')
			}
		});
		verified = false
	}
	else {
		$("[id^=evidence_]:not([id$=_display])").removeClass('border border-warning')
	}
	
	return verified
}

$(document).ready(function() {
	// Display game version
	$("#version").text("Game Version {0}".format(GAME_VERSION))
	
	// Fill location and difficult fields
	for (i = 0; i < LOCATIONS.length; i++) {
		$("#main_location").append(new Option(LOCATIONS[i]))
	}
	for (i = 0; i < DIFFICULTIES.length; i++) {
		$("#main_difficulty").append(new Option(DIFFICULTIES[i]))
	}
	
	// Fill name fields
	for (i = 0; i < NAMES_FIRST.length; i++) {
		$("#main_name_first").append(new Option(NAMES_FIRST[i]))
	}
	for (i = 0; i < NAMES_LAST.length; i++) {
		$("#main_name_last").append(new Option(NAMES_LAST[i]))
	}
	
	// Setup objective selectors
	$("select[id^=objective]").change(objectiveUpdate).each(function() {
		if ($(this).attr('id') == "objective_1") {
			$(this).empty().append(new Option(OBJECTIVE_MAIN)).prop('disabled', true)
		}
		else {
			for (i = 0; i < OBJECTIVE_BONUS.length; i++) {
				$(this).append(new Option(OBJECTIVE_BONUS[i]))
			}
		}
	});
	
	// Setup reporting options
	for (i = 0; i < REPORTS.length; i++) {
		$("#main_report").append(new Option(REPORTS[i]))
	}
	
	// Setup evidence buttons
	$("#evidence_emf_ruleout").click(evidenceToggle)
	$("#evidence_emf_observe").click(evidenceToggle)
	$("#evidence_fingerprints_ruleout").click(evidenceToggle)
	$("#evidence_fingerprints_observe").click(evidenceToggle)
	$("#evidence_freezing_ruleout").click(evidenceToggle)
	$("#evidence_freezing_observe").click(evidenceToggle)
	$("#evidence_orb_ruleout").click(evidenceToggle)
	$("#evidence_orb_observe").click(evidenceToggle)
	$("#evidence_writing_ruleout").click(evidenceToggle)
	$("#evidence_writing_observe").click(evidenceToggle)
	$("#evidence_box_ruleout").click(evidenceToggle)
	$("#evidence_box_observe").click(evidenceToggle)
	
	// Setup Characteristics
	var characteristics = [
		createCharacteristic("Door Interaction", "door_interaction"),
		createCharacteristic("Item Movement", "item_movement"),
		createCharacteristic("Item Interaction", "item_interaction"),
		createCharacteristic("Lights On", "lights_on"),
		createCharacteristic("Lights Off", "lights_off"),
		createCharacteristic("Lights Flicker", "lights_flicker"),
		createCharacteristic("Breaker Off", "breaker_off"),
		createCharacteristic("Breaker On", "breaker_on"),
		createCharacteristic("Roaming", "roaming"),
		createCharacteristic("Shrill", "shrill"),
		createCharacteristic("Mimic", "mimic"),
		createCharacteristic("Appear Stationary", "appear_stationary"),
		createCharacteristic("Appear Wiggle", "appear_wiggle"),
		createCharacteristic("Appear Approaching", "appear_approaching"),
		createCharacteristic("Appear Shadow", "appear_shadow"),
		createCharacteristic("Appear Detail", "appear_detail"),
		createCharacteristic("Ouija", "ouija"),
		createCharacteristic("Sound Sensor", "sound"),
	]
	for (i = 0; i < characteristics.length; i++) {
		$("#form_characteristics").append(characteristics[i])
	}
	
	// Setup control buttons
	$("#control_reset").click(reset)
	$("#control_report").click(report)
});

/* Prototype Extensions */

// Functionality similar to python string.format()
String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

// check whether the set on which the  
// method is invoked is the subset of  
// otherset or not 
Set.prototype.subSet = function(otherSet) 
{ 
    // if size of this set is greater 
    // than otherSet then it can'nt be  
    //  a subset 
    if(this.size > otherSet.size) 
        return false; 
    else
    { 
        for(var elem of this) 
        { 
            // if any of the element of  
            // this is not present in the 
            // otherset then return false 
            if(!otherSet.has(elem)) 
                return false; 
        } 
        return true; 
    } 
} 

// Perform union operation between  
// called set and otherSet 
Set.prototype.union = function(otherSet) 
{ 
    // creating new set to store union 
    var unionSet = new Set(); 
  
    // iterate over the values and add  
    // it to unionSet 
    for (var elem of this) 
    { 
        unionSet.add(elem); 
    } 
  
    // iterate over the values and add it to  
    // the unionSet 
    for(var elem of otherSet) 
        unionSet.add(elem); 
  
    // return the values of unionSet 
    return unionSet; 
} 

// Performs intersection operation between 
// called set and otherSet 
Set.prototype.intersection = function(otherSet) 
{ 
    // creating new set to store intersection 
    var intersectionSet = new Set(); 
  
    // Iterate over the values  
    for(var elem of otherSet) 
    { 
        // if the other set contains a  
        // similar value as of value[i] 
        // then add it to intersectionSet 
        if(this.has(elem)) 
            intersectionSet.add(elem); 
    } 
  
// return values of intersectionSet 
return intersectionSet;                 
} 

// Performs difference operation between 
// called set and otherSet 
Set.prototype.difference = function(otherSet) 
{ 
    // creating new set to store difference 
     var differenceSet = new Set(); 
  
    // iterate over the values 
    for(var elem of this) 
    { 
        // if the value[i] is not present  
        // in otherSet add to the differenceSet 
        if(!otherSet.has(elem)) 
            differenceSet.add(elem); 
    } 
  
    // returns values of differenceSet 
    return differenceSet; 
} 