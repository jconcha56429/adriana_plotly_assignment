d3.json("samples.json").then(function(data){
    console.log(data);
});


// wfreq only filterd and in descending order 
d3.json("samples.json").then(function(data){
    wfreq = data.metadata.map(person =>
person.wfreq).sort((a,b) => b - a);
    filteredWfreq = wfreq.filter(element => element !=
null);
    console.log(filteredWfreq);
});