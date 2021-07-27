rawgKey="ad7de449944a49eb8e4ece2f99e17776";
let game='';
let textInfo="";
function GetWeather() {
    game = $('#game').val();
    $('#socialgrep').empty();
    $('#forecast').empty();
    $('#forecast').show();
    $('#one-game').empty();
    $('#city').val("");
    displayGames(game);

}
//  function display weather parameters: city name and boolean newSearch (add new city button or not)
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
                    mainDiv.addClass("card-columns");
                for (i = 0; i < data.results.length; i++) {
                    

                    let div = $('<div>');
                     div.addClass("card bg-forecast text-light m-2 p-2");
                     let h5 = $('<h5>');
                     h5.text(data.results[i].name);
                     let icon = $('<img>');
                     icon.addClass("mx-auto");
                     icon.attr("src", data.results[i].background_image);
                     icon.attr("width", 200);
                     div.attr('data-game-slug', data.results[i].slug);
                     div.append(h5);
                     div.append(icon);
                     div.on( 'click', function(event){
                        event.preventDefault();
                        gameInfo($(this).attr('data-game-slug'));

                     });
                     mainDiv.append(div);
 
                 }
                
                 $('#forecast').append(mainDiv);

                });
            } else {
                $('#forecast').empty();
                $('#forecast').text("game not found");
            }
        })
        .catch(function (error) {

            alert("Unable to connect to openweathermap.org");
        });


}
let gameInfo=function(gameSlug){
   console.log(game);
   $('#forecast').hide();
   $('#one-game').show();
   $('#one-game').empty();
   $('#socialgrep').empty();
   btnBack = $('<button>');
    btnBack .addClass('btn btn-primary mt-2 mb-2 btn-block');
    btnBack.text("Go back");
    
    btnBack .on('click', function (event) {
        event.preventDefault();
        $('#forecast').show();
        $('#one-game').hide();
        $('#socialgrep').hide();

    })
    $('#one-game').append(btnBack);

    apiURLlDetailed=`https://api.rawg.io/api/games/${gameSlug}?&key=${rawgKey}`;
    fetch(apiURLlDetailed)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);

              
                let mainDiv = $('<div>');
                mainDiv.addClass("");
                    let h4 = $('<h5>');
                    h4.text(data.name);
                    mainDiv.append(h4);
                    let icon = $('<img>');
                    icon.addClass("mx-auto");
                    icon.attr("src", data.background_image);
                    icon.attr("width", 800);
                    mainDiv.append(icon);
                    let div=$('<div>');
                    div.html(data.description);
                    mainDiv.append(div);
                    $('#one-game').append(mainDiv);
                    Socialgrep(data.name);
                
            });
        })
        .catch(function (error) {
            alert("Unable to connect to openweathermap.org");
        });
   
}


//Review: https://www.giantbomb.com/api/review/[guid]/?api_key=d98fe8a413e6c337edd8959849e3c726b0bcbaf0
//http://www.giantbomb.com/api/game/3030-4725/?api_key=[YOUR-KEY]&format=json&field_list=genres,name
//Query Structure: http://www.giantbomb.com/api/[RESOURCE-TYPE]/[RESOURCE-ID]/?api_key=[YOUR-KEY]&format=[RESPONSE-DATA-FORMAT]&field_list=[COMMA-SEPARATED-LIST-OF-RESOURCE-FIELDS]
//Example: http://www.giantbomb.com/api/search/?api_key=[YOUR-KEY]&format=json&query="metroid prime"&resources=game
let Socialgrep=function(game){
    SGUrl=`http://www.giantbomb.com/api/search/?api_key=d98fe8a413e6c337edd8959849e3c726b0bcbaf0&format=json&query="{game}&resources=game`;
    fetch(SGUrl, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "d98fe8a413e6c337edd8959849e3c726b0bcbaf0",
		"x-rapidapi-host": "http://www.giantbomb.com"
	}
})
.then(function (response) {
    response.json().then(function (data) {
        console.log(data);
        let h4 = $('<h5>');
         h4.text("Data from GiantBomb:");
        $('#socialgrep').append(h4);
        for (i=0; i<data.data.length;i++){
            let p=$('<p>');p2=$('<p>');p3=$('<p>');
            if (data.data[i].selftext){
                p.text(data.data[i].domain+ " post");
                p2.text(data.data[i].title);
                p3.text(data.data[i].selftext);
                $('#socialgrep').append(p);
                $('#socialgrep').append(p2);
                $('#socialgrep').append(p3);
                $('#socialgrep').append($('</br>'));
            }
        }
    });
})
.catch(function (error) {
    alert("Unable to connect to GiantBomb");
});
}
$('#search').click(GetWeather);