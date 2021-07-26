rawgKey="ad7de449944a49eb8e4ece2f99e17776";
let game='';
let textInfo="";
$('#one-game').hide();
window.onload = function() {
    // short timeout
    setTimeout(function() {
        window.scrollTo(0,0);
    }, 15);
};
function GetWeather() {
    game = $('#game').val();
  //  $('#socialgrep').empty();
  $('#one-game').hide();
    $('#forecast').empty();
  //  $('#one-game').empty();
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
                    mainDiv.addClass("grid game-wrap gap-4 mx-auto w-10/12  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row");
                for (i = 0; i < data.results.length; i++) {
                    

                    let div = $('<div>');
                     div.addClass("mb-10 m-2 game  bg-gray-100 ");

                     let icon = $('<img>');
                     icon.addClass("w-full");
                     icon.attr("src", data.results[i].background_image);
                     div.append(icon);
                    let divName=$('<div>');
                    divName.addClass("desc p-4 text-gray-800");
                      let h5 = $('<h5>');
                     h5.text(data.results[i].name);
                     divName.append(h5);
                     div.append(divName);

                     div.attr('data-game-slug', data.results[i].slug);
                     div.append(h5);
                    
                     div.on( 'click', function(event){
                        event.preventDefault();
                        gameInfo($(this).attr('data-game-slug'));

                     });
                     mainDiv.append(div);
 
                 }
                
                 $('#forecast').append(mainDiv);
                //  $('#forecast').scrollIntoView();
                // getElementById("forecast").scrollIntoView();
                 let scrollDiv = document.getElementById("forecast").offsetTop;
window.scrollTo({ top: scrollDiv, behavior: 'smooth'});

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
   $('#one-game').show();
   //$('#one-game').empty();
   //$('#socialgrep').empty();


    apiURLlDetailed=`https://api.rawg.io/api/games/${gameSlug}?&key=${rawgKey}`;
    fetch(apiURLlDetailed)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);

              
                // let mainDiv = $('<div>'), descDiv = $('<div>');
                // mainDiv.addClass("text-white");
                // let h2 = $('<h2>');
                $('#game-name').text(data.name);
                $('#game-img').attr("src", data.background_image);
                $('#description').html(data.description);
                

                // mainDiv.append(h2);
                // let jumboDiv=$('<div>');
                //     jumboDiv.addClass("flex flex-col lg:flex-row  space-x-4  mx-auto  flex-auto");
                    
                //     let icon = $('<img>');
                //     icon.addClass("object-contain w-3/5");
                //     icon.attr("src", data.background_image);
                    
                //     jumboDiv.append(icon);

                   
                   
                //     let div=$('<div>');
                //     div.html(data.description);
                //     descDiv.append(div);
                //     jumboDiv.append(descDiv);
                //     mainDiv.append(jumboDiv);
                //     $('#one-game').append(mainDiv);
                   // Socialgrep(data.name); 
                   $('one-game').show();
                    let scrollDiv = document.getElementById("one-game").offsetTop;
                    window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
                
            });
        })
        .catch(function (error) {
            alert("Unable to connect to openweathermap.org");
        });
   
}

let Socialgrep=function(game){
    SGUrl=`https://socialgrep.p.rapidapi.com/search/posts?query=${game}`;
    fetch(SGUrl, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "cfad5dea77mshfa65b5044f9903dp1a13d5jsn51d29068967e",
		"x-rapidapi-host": "socialgrep.p.rapidapi.com"
	}
})
.then(function (response) {
    response.json().then(function (data) {
        console.log(data);
        let h4 = $('<h5>');
         h4.text("Data from Socialgrep:");
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
    alert("Unable to connect to openweathermap.org");
});
}
$('#search').click(GetWeather);