// declare variables
rawgKey = "ad7de449944a49eb8e4ece2f99e17776";
gbKey = "82377eacd0eaabd596437efbea6cb8449b5bd190";
let game = '';
$('#one-game').hide();
window.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 15);
};
function SearchButtonClick() {
    game = $('#game').val();
    $('#game').val("");
    $('#one-game').hide();
    $('#forecast').empty();
    $('#city').val("");
    displayGames(game);

}
//  Get games list from rawg api; display game cards
let displayGames = function (game) {
    let apiUrl = `https://api.rawg.io/api/games?&search=${game}&key=${rawgKey}`;
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    // show current weather
                    console.log(data);
                    let mainDiv = $('<div>');
                    mainDiv.addClass("grid game-wrap gap-4 mx-auto w-10/12  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row");
                    for (i = 0; i < data.results.length; i++) {
                        let div = $('<div>');
                        div.addClass("mb-10 m-2 game  bg-gray-100 ");

                        let icon = $('<img>');
                        icon.addClass("w-full");
                        icon.attr("src", data.results[i].background_image);
                        div.append(icon);
                        let divName = $('<div>');
                        divName.addClass("desc p-4 text-gray-800");
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

                    $('#forecast').append(mainDiv);
                    //scroll down
                    let scrollDiv = document.getElementById("forecast").offsetTop;
                    window.scrollTo({ top: scrollDiv, behavior: 'smooth' });

                });
            } else {
                $('#forecast').empty();
                $('#forecast').text("game not found");
            }
        })
        .catch(function (error) {
            $('#forecast').empty();
            $('#forecast').text("Unable to connect to api.rawg.io");
        });


}
// Detailed chosen game info
let gameInfo = function (gameSlug) {
    console.log(game);
    $('#game-content').empty();
    $('#one-game').show();
    // slug fetch
    apiURLlDetailed = `https://api.rawg.io/api/games/${gameSlug}?&key=${rawgKey}`;
    fetch(apiURLlDetailed)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                game = data.name;
                $('#game-name').text(data.name);
                $('#game-img').attr("src", data.background_image);
                $('#description').html(data.description);
                $('one-game').show();
                let scrollDiv = document.getElementById("one-game").offsetTop;
                window.scrollTo({ top: scrollDiv, behavior: 'smooth' });

            });
        })
        //redo it! alert
        .catch(function (error) {
            alert("Unable to connect to openweathermap.org");
        });

}
// get and show characters / giant bomb api
function GBsearch() {
    // search by game name
    GBUrl = `https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/search/?api_key=${gbKey}&format=json&query="${game}"&resources=game&limit=1`;
    fetch(GBUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    // detailed fetch for the first game from response
                    console.log(data);
                    if (data.results.length > 0) {
                        fetch(`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/game/${data.results[0].guid}/?api_key=${gbKey}&format=json`)
                            .then(function (response) {
                                return response.json();
                            })
                            .then(function (data) {
                                console.log(data);
                                if (data.results.characters) {
                                    for (i = 0; i < data.results.characters.length; i++) {
                                        let characterId = data.results.characters[i].id;
                                        console.log("id " + characterId);
                                        // if there is a list of characters new fetch for each item
                                        fetch(`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/characters/?filter=id:${characterId}&api_key=${gbKey}&format=json`)
                                            .then(function (response) {
                                                return response.json();
                                            })
                                            .then(function (data) {
                                                console.log(data);
                                                console.log("---");
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
                                }
                                else { NothingFound(); }
                            }

                            );
                    } else { NothingFound(); }
                });


            } else { NothingFound(); }
        })
        .catch(function (error) {

            alert("Unable to connect to openweathermap.org");
        });
}
// no characters data found
let NothingFound = function () {
    let msg = $('<p>');
    msg.text("nothing found");
    msg.addClass("m-8 text-center text-l text-gray-200");
    $('#game-content').append(msg);
}
// characters button
$('#characters').click(GBsearch);
//search button
$('#search').click(SearchButtonClick);