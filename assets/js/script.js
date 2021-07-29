rawgKey="ad7de449944a49eb8e4ece2f99e17776";
gbKey="82377eacd0eaabd596437efbea6cb8449b5bd190";
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
    $('#game-content').empty();
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
                 game=data.name;
                 $('#game-name').text(data.name);
                 $('#game-img').attr("src", data.background_image);
                 $('#description').html(data.description);
                    $('one-game').show();
                     let scrollDiv = document.getElementById("one-game").offsetTop;
                     window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
                 
             });
         })
         .catch(function (error) {
             alert("Unable to connect to openweathermap.org");
         });
    
 }

function GBsearch(){
    GBUrl=`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/search/?api_key=${gbKey}&format=json&query="${game}"&resources=game&limit=1`;
    fetch(GBUrl)
    .then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function (data) {
             
                // search details for this game
                console.log(data);
                if (data.results.length>0){
                fetch(`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/game/${data.results[0].guid}/?api_key=${gbKey}&format=json`)
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
                    console.log(data);
                    if (data.results.characters){
                        for (i=0;i<data.results.characters.length;i++){
                           let characterId=data.results.characters[i].id;
                           console.log("id "+characterId);
                            //get guide
                           // console.log(`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/characters/?filter=id:${characterId}&api_key=${gbKey}}&format=json`)
                            fetch(`https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/characters/?filter=id:${characterId}&api_key=${gbKey}&format=json`)
                            .then(function(response){
                                return response.json();
                        })
                        .then(function(data){
                            console.log(data);
                            console.log("---");
                        //     <div class="p-6  border-b  bg-gray-800 border-gray-700 sm:px-20">
                        //     <div id="game-name" class="mt-8 text-2xl text-gray-200"> </div>
                        //     <div class="flex flex-col lg:flex-row  space-x-4  mx-auto  flex-auto">
                        //         <img id="game-img" alt="after!!" class="object-contain w-1/2 align-top ">
                        //         <div id="description" class="text-gray-200"></div>
                        //     </div>
                        // </div>
                        //<div id="game-name" class="mt-8 text-2xl text-gray-200"> </div>
                        //p-6  border-b  bg-gray-800 border-gray-700 sm:px-20
                        let divName=$('<div>'), divInfo=$('<div>'), chDiv=$('<div>'), divCont=$('<div>');
                        chDiv.addClass('p-6  border-b  bg-gray-800 border-gray-700 sm:px-20');
                        
                        divName.text(data.results[0].name);
                        divName.addClass("mt-8 text-2xl text-gray-200");
                        chDiv.append(divName);
                        divInfo.addClass("flex flex-col lg:flex-row  space-x-4  mx-auto  flex-auto text-gray-200");
                        let icon = $('<img>');
                     icon.addClass("object-contain h-24");
                     icon.attr("src", data.results[0].image.icon_url);
                     divInfo.append(icon);
                     let p1 = $('<p>'),p2 = $('<p>');
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
                    }}
                    else {NothingFound();}
                }

                );
                }else{NothingFound(); }
        });
            
           
        } else {NothingFound();}
    })
    .catch(function (error) {

        alert("Unable to connect to openweathermap.org");
    });
}
let NothingFound=function(){
    let msg = $('<p>');
            msg.text("nothing found");
            msg.addClass("m-8 text-center text-l text-gray-200");
            $('#game-content').append(msg);
}

$('#characters').click(GBsearch);
$('#search').click(GetWeather);