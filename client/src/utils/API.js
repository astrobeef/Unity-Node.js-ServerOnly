export default{
    getPlayers: function(){

        return fetch("api/players")
        .then(function(response){
            if(response.status !== 200){
                console.error(`problem found with status code : ${response.status}`);
                console.warn(`Returning dummy response`);

                const dummyData = [
                    {
                        _id : "12345abc_dummy",
                        connection_id: "D5e315_dummy",
                        username : "Dummy Player",
                        connected : true,
                        __v : 0,
                        key : 0.333334
                    }
                ]

                return dummyData;
            }

            return response.json().then(function(data){
                return data;
            })
        })
        .catch(function(err){
            console.log(`fetch error : ${err}`);
        })

    }
}