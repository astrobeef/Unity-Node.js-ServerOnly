export default{
    getPlayers: async function(){

        return await fetch("api/players")
        .then(function(response){
            if(response.status !== 200){
                console.log(`problem found with status code : ${response.status}`);
                return;
            }

            return response.json().then(function(data){
                console.log(data);
                return data;
            })
        })
        .catch(function(err){
            console.log(`fetch error : ${err}`);
        })

    }
}