/*Global variable - needed in multiple functions*/
var programArray = [];

/*Function to initialise and parse data*/
function init(url) {

    var resp;
    var xmlHttp;

    resp = '';
    /*Needed if data hosted on server*/
    xmlHttp = new XMLHttpRequest();

    if (xmlHttp != null) {
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        resp = xmlHttp.responseText;
    }

    var jsonResp = JSON.parse(resp);

    for (i = 0; i < jsonResp.topics.length; i++) {
        var topic = jsonResp.topics[i];

        let topicButton = document.createElement('button');
        topicButton.setAttribute("class", "sort_type_item");
        topicButton.appendChild(document.createTextNode("▲ " + topic.name));

        document.getElementById("programs").appendChild(topicButton);

        var topicContentDiv = document.createElement('div');
        topicContentDiv.setAttribute("class", "content");

        let topicImage = document.createElement('img');
        topicImage.setAttribute("src", topic.cover_image);
        topicImage.setAttribute("class", " col-md-4 col-xs-12 topic_img");
        topicImage.setAttribute("style", "float: right");


        topicContentDiv.appendChild(topicImage);
        document.getElementById("programs").appendChild(topicContentDiv);

        var topicProgramsDiv = document.createElement('div');
        topicProgramsDiv.setAttribute("class", "programs col-md-8 col-xs-12");

        for (j = 0; j < topic.programs.length; j++) {
            //Used later for the filter/sort functionality 
            topic.programs[j]["topic"] = topic.name;
            topic.programs[j]["topic_cover_image"] = topic.cover_image;

            programArray.push(topic.programs[j]);
            let programItemDiv = document.createElement('div');
            //THIS ASSUMES THAT THE PROGRAM IDS ARE UNIQUE ACCROSS ALL DATA
            programItemDiv.setAttribute("id", "program" + topic.programs[j].id);

            let programTitleText = document.createElement('p');
            programTitleText.innerHTML = topic.programs[j].title;
            let programLocationText = document.createElement('p');
            programLocationText.innerHTML = topic.programs[j].location.title;
            let programStartingTimeText = document.createElement('p');
            programStartingTimeText.innerHTML = topic.programs[j].start_time;

            programItemDiv.appendChild(programTitleText);
            programItemDiv.appendChild(programStartingTimeText);
            programItemDiv.appendChild(programLocationText);


            let line = document.createElement('hr');
            topicProgramsDiv.appendChild(line);
            topicProgramsDiv.appendChild(programItemDiv);
        }

        topicContentDiv.appendChild(topicProgramsDiv);

    }

    setupbuttons();
    matchingInputs(document.getElementById("program_input"), programArray);

}

/*Function to display matching inputs*/
function matchingInputs(input, array) {

    input.addEventListener("input", function (e) {

        var inputValue = input.value;

        CloseMatchingContainer();

        //Matching programs container div
        var programContainer = document.createElement("div");
        programContainer.setAttribute("class", "matching_input_items");
        //autocomplete is called from <body>
        this.parentNode.appendChild(programContainer);

        for (i = 0; i < array.length; i++) {
            if (inputValue != "" && array[i].title.substr(0, inputValue.length).toUpperCase() == inputValue.toUpperCase()) {
                let programTitle = array[i].title;
                let programId = array[i].id;

                let matchingInputContainer = document.createElement("div");
                matchingInputLink = document.createElement("a");
                matchingInputLink.setAttribute("href", "#program" + programId)

                let inputProgramName = document.createElement("p");
                inputProgramName.setAttribute("class", "input_program_name");
                inputProgramName.innerHTML = programTitle.substr(0, inputValue.length);
                matchingInputLink.appendChild(inputProgramName);
                matchingInputLink.innerHTML += programTitle.substr(inputValue.length, programTitle.length);
                matchingInputContainer.appendChild(matchingInputLink);
                programContainer.appendChild(matchingInputContainer);
            }
        }
    });

    // Click somewhere else to close the matching container
    document.addEventListener("click", function (event) {
        CloseMatchingContainer(event.target);
    });

    function CloseMatchingContainer(element) {
        matchingInputContainer = document.getElementsByClassName("matching_input_items");
        for (var i = 0; i < matchingInputContainer.length; i++) {
            if (element != input && element != matchingInputContainer[i]) {
                matchingInputContainer[i].parentNode.removeChild(matchingInputContainer[i]);
            }
        }
    }

}


/*Function to set up the collapsable buttons*/
function setupbuttons() {
    //create the collapsables
    var sortTypeItems = document.getElementsByClassName("sort_type_item");
    var i;

    for (i = 0; i < sortTypeItems.length; i++) {
        //"click" is the type of event
        sortTypeItems[i].addEventListener("click", function () {
            this.classList.toggle("active");
            //Next sibling element after each element with class = "topic" 
            var content = this.nextElementSibling;
            if (content.style.display === "none") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        });
    }


}

/*Function to order the data by either location, start time or department*/
function sort(sortType) {

    function normaliseCompare(a, b) {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }

    function compare(a, b) {
        if (a[sortType] < b[sortType]) {
            return -1;
        }
        if (a[sortType] > b[sortType]) {
            return 1;
        }
        return 0;
    }

    programArray.sort(normaliseCompare);
    programArray.sort(compare);

    document.getElementById("programs").innerHTML = "<br/>";

    for (i = 0; i < programArray.length; i++) {
        let programItemDiv = document.createElement('div');
        programItemDiv.setAttribute("id", "program" + programArray[i].id);

        let programTitleText = document.createElement('p');
        programTitleText.innerHTML = programArray[i].title;
        let programLocationText = document.createElement('p');
        programLocationText.innerHTML = programArray[i].location.title;
        let programStartingTimeText = document.createElement('p');
        programStartingTimeText.innerHTML = programArray[i].start_time;

        programItemDiv.appendChild(programTitleText);
        programItemDiv.appendChild(programStartingTimeText);
        programItemDiv.appendChild(programLocationText);

        if (i == 0 || programArray[i - 1][sortType] != programArray[i][sortType]) {
            if (document.contains(sortTypeItemContentDiv)) {
                sortTypeItemContentDiv.appendChild(sortTypeItemProgramsDiv);
                document.getElementById("programs").appendChild(sortTypeItemContentDiv);
            }

            var sortTypeItemContentDiv = document.createElement('div');
            sortTypeItemContentDiv.setAttribute("class", "content");

            var sortTypeItemProgramsDiv = document.createElement('div');
            sortTypeItemProgramsDiv.setAttribute("class", "programs");

            var sortTypeItemButton = document.createElement('button');
            sortTypeItemButton.setAttribute("class", "sort_type_item");

            document.getElementById("programs").appendChild(sortTypeItemButton);

            var sortTypeItemImage = document.createElement('img');
            sortTypeItemImage.setAttribute("class", "topic_img");

            switch (sortType) {
                case 'location_id':
                    sortTypeItemButton.appendChild(document.createTextNode("▲ " + programArray[i].location.title));
                    sortTypeItemImage.setAttribute("src", programArray[i].location.cover_image);
                    break;
                case 'start_time':
                    sortTypeItemButton.appendChild(document.createTextNode("▲ " + programArray[i].start_time));
                    //No image for start time
                    break;
                case 'topic':
                    sortTypeItemButton.appendChild(document.createTextNode("▲ " + programArray[i].topic));
                    sortTypeItemImage.setAttribute("src", programArray[i].topic_cover_image);
                    break;
                default:
            }

            sortTypeItemContentDiv.appendChild(sortTypeItemImage);
            document.getElementById("programs").appendChild(sortTypeItemContentDiv);
        }

        let line = document.createElement('hr');
        sortTypeItemProgramsDiv.appendChild(line);
        sortTypeItemProgramsDiv.appendChild(programItemDiv);
    }
    setupbuttons();
}
