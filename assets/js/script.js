// declare variables
rawgKey = "ad7de449944a49eb8e4ece2f99e17776";
gbKey = "82377eacd0eaabd596437efbea6cb8449b5bd190";
let game = '';
$('#one-game').hide();
//scroll up
window.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 15);
};
// call displyGames and add new item to localstorage game hisory list
function SearchButtonClick() {
    game = $('#game').val();
    $('#game').val("");
    $('#one-game').hide();
    $('#gameCards').empty();
    displayGames(game);
    let hisoryList=JSON.parse(localStorage.getItem('history-list')) || [];
    hisoryList.push(game);
    localStorage.setItem('history-list', JSON.stringify(hisoryList));
}

//  Get game list from rawg api; display game cards
let displayGames = function (game) {
    $('#gameCards').empty();
    let apiUrl = `https://api.rawg.io/api/games?&search=${game}&key=${rawgKey}`;
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {        
                    console.log(data);
                     // show game cards
                    let mainDiv = $('<div>');
                    mainDiv.addClass("grid game-wrap gap-4 mx-auto w-10/12  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row");
                    for (i = 0; i < data.results.length; i++) {
                        let div = $('<div>');
                        div.addClass("mb-5 m-2 game  bg-gray-100 ");
                        let icon = $('<img>');
                        icon.addClass("w-full");
                        icon.attr("src", data.results[i].background_image);
                        div.append(icon);
                        let grayInfo=$('<div>');
                        grayInfo.addClass("info-box text-xs flex p-1 font-semibold text-gray-500 bg-gray-300");
                        let span1=$('<span>');
                        span1.addClass("mr-1 p-1 px-2 font-bold");
                        span1.text("released: "+data.results[i].released);
                        grayInfo.append(span1);
                        div.append(grayInfo);
                        let divName = $('<div>');
                        divName.addClass( "p-1 m-1 text-gray-800");
                        let h5 = $('<h5>');
                        h5.text(data.results[i].name);
                        divName.append(h5);
                        div.append(divName);
                        // add data-game-slug attribute on every card for detailed fetch 
                        div.attr('data-game-slug', data.results[i].slug);
                        div.append(h5);
                        // add on click function
                        div.on('click', function (event) {
                            event.preventDefault();
                            gameInfo($(this).attr('data-game-slug'));

                        });
                        mainDiv.append(div);
                    }
                    $('#gameCards').append(mainDiv);
                    //scroll down
                    let scrollDiv = document.getElementById("gameCards").offsetTop;
                    window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
                });
            } else {
                $('#gameCards').empty();
                $('#gameCards').text("game not found");
            }
        })
        .catch(function (error) {
            $('#gameCards').empty();
            $('#gameCards').text("Unable to connect to api.rawg.io");
        });


}

// Detailed chosen game info
let gameInfo = function (gameSlug) {
    console.log(game);
    $('#game-content').empty();
    $('#game-genre').empty();
    $('#game-rating').empty();
    $("#game-platform").empty();
    $("#game-website").empty();
    $('#one-game').show();
    // slug fetch
    apiURLlDetailed = `https://api.rawg.io/api/games/${gameSlug}?&key=${rawgKey}`;
    fetch(apiURLlDetailed)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                // game name, image, and description
                game = data.name;
                $('#game-name').text(data.name);
                $('#game-img').attr("src", data.background_image);
                $('#description').html(data.description);
                // info cell
                if (data.genres){
                    let p1 = $('<p>');
                    p1.text("Genres:  ");
                    for (i=0;i<data.genres.length;i++){
                        p1.text(p1.text()+data.genres[i].name+", ");
                    }
                    p1.text(p1.text().slice(0, -2));
                    $('#game-genre').append(p1);
                }
                if (data.developers){
                    let p1 = $('<p>');
                    p1.text("Developers:  ");
                    for (i=0;i<data.developers.length;i++){
                        p1.text(p1.text()+data.developers[i].name+", ");
                    }
                    p1.text(p1.text().slice(0, -2));
                    $('#game-genre').append(p1);
                }
                //rating cell
                if (data.ratings){
                    
                    for (i=0;i<data.ratings.length;i++){
                        let p1 = $('<p>');
                        p1.text(data.ratings[i].title+", percent: "+ data.ratings[i].percent+ "%");
                        $('#game-rating').append(p1);
                    }   
                }
                //platforms cell
                if (data.platforms){
                    let p1 = $('<p>');
                    for (i=0;i<data.platforms.length;i++){
                        p1.text(p1.text() + data.platforms[i].platform.name+", ");
                    }
                    p1.text(p1.text().slice(0, -2));
                    $('#game-platform').append(p1);
                }
                // website cell
                let site = $('<a>');
                site.text(data.website);
                site.attr("href", data.website); 
                $("#game-website").append(site);

                //scrol down
                let scrollDiv = document.getElementById("one-game").offsetTop;
                window.scrollTo({ top: scrollDiv, behavior: 'smooth' });

            });
        })
        .catch(function (error) {
             $('#game-name').text("Unable to connect to api.rawg.io");
        });
}
// get and show characters / giant bomb api
function GBsearch() {
    $('#game-content').empty();
    // search by game name
    GBUrl = `https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/search/?api_key=${gbKey}&format=json&query="${game}"&resources=game&limit=1`;
    fetch(GBUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    // detailed fetch for the first game from the response
                    if (data.results.length > 0) {
                        fetch(`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/game/${data.results[0].guid}/?api_key=${gbKey}&format=json`)
                            .then(function (response) {
                                return response.json();
                            })
                            .then(function (data) {
                                console.log(data);
                                // if the list of characters is not null...
                                if (data.results.characters) {
                                    for (i = 0; i < data.results.characters.length; i++) {
                                        let characterId = data.results.characters[i].id;
                                        console.log("id " + characterId);
                                        // ... new fetch for each item
                                        fetch(`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/characters/?filter=id:${characterId}&api_key=${gbKey}&format=json`)
                                            .then(function (response) {
                                                return response.json();
                                            })
                                            .then(function (data) {
                                                console.log(data);
                                                console.log("---");
                                                // display character
                                                let divName = $('<div>'), divInfo = $('<div>'), chDiv = $('<div>'), divCont = $('<div>');
                                                chDiv.addClass('p-6  border-b  bg-gray-800 border-gray-700 sm:px-20');
                                                divName.text(data.results[0].name);
                                                divName.addClass("mt-8 text-2xl text-gray-200");
                                                chDiv.append(divName);
                                                divInfo.addClass("flex flex-col lg:flex-row  space-x-4  mx-auto  flex-auto text-gray-200");
                                                let icon = $('<img>');
                                                icon.addClass("object-contain h-24");
                                                icon.attr("src", data.results[0].image.icon_url);
                                                divInfo.append(icon);
                                                let p1 = $('<p>'), p2 = $('<p>');
                                                p1.html(data.results[0].deck);
                                                p1.addClass("mt-2 text-sm text-gray-400");
                                                divCont.append(p1);
                                                p2.html(data.results[0].description);
                                                p2.addClass("mt-2 text-sm text-gray-400");
                                                divCont.append(p2);
                                                divInfo.append(divCont);
                                                chDiv.append(divInfo);
                                                $('#game-content').append(chDiv);

                                            });
                                    }
                                     //scroll to characters
                                    let scrollDiv = document.getElementById("characters").offsetTop;
                                    window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
                                }
                                else { NothingFound(); }
                            }

                            );
                    } else { NothingFound(); }
                });


            } else { NothingFound(); }
        })
        .catch(function (error) {
            $('#game-content').text("Unable to connect to giantbomb.com/api/");
        });
}

// no characters data found
let NothingFound = function () {
    let msg = $('<p>');
    msg.text("nothing found");
    msg.addClass("m-8 text-center text-l text-gray-200");
    $('#game-content').append(msg);
}

// get data from local storage, add search history items
function FillSearchHistory(){
    $("#history-selector").empty();
    $("#history-selector").addClass("absolute right-0 w-56 mt-4 origin-top-right  divide-y divide-gray-700 bg-red-600  text-white  shadow-lg outline-none");
    let hisoryList=JSON.parse(localStorage.getItem('history-list')) || [];
    // in case it is empty
    if (hisoryList.length===0){
        let divMain = $('<div>');
       divMain.addClass("py-1");
        let msg = $('<p>');
        msg.addClass("hover:bg-red-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left");
        msg.text("history is empty");
        divMain.append(msg);
        $("#history-selector").append(divMain);

    }
    // else fill selector
    else{
    for (i=0;i<hisoryList.length;i++){
       let divMain = $('<div>');
       divMain.addClass("py-1");
        let msg = $('<p>');
        msg.addClass("hover:bg-red-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left");
        msg.text(hisoryList[i]);
        msg.on('click', function (event) {
            event.preventDefault();
            game=$(this).text();
            displayGames(game);
        })
        divMain.append(msg);
        $("#history-selector").append(divMain);
    }
}

}


// characters button
$('#characters').click(GBsearch);
//main search button
$('#search').click(SearchButtonClick);
// search hisory button
$('#historyButton').click(FillSearchHistory);