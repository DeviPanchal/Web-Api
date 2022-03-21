const {MongoClient} = require('mongodb');
const express = require('express');  
const bodyParser = require('body-parser');  
const cors = require('cors');  
const Port = 1000;  
const app = express();  

var Dependencies = {}
var devDependencies = {}

var url = "mongodb://localhost:27017/";


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})) 
app.use(cors()); 


app.post('/fetching_packages', function(req, res) {  
    dataSource = req.body;
    debugger
    Dependencies = dataSource.Dependencies;
    devDependencies = dataSource.devDependencies;
    // console.log(Dependencies);
    // console.log(devDependencies)
    res.json(dataSource)
    debugger
    storing_data_in_database()
    debugger
})  

app.get('/fetched_data', function(req, res) {  
    // console.log(Dependencies); 

    
    res.status(200).send({ 
        Dependencies,
        devDependencies
        })  
})

app.listen(Port, function() {  
    console.log('server running on localhost: ' + Port)  
}); 

var Whole_Package = []
function storing_data_in_database() {

    MongoClient.connect(url, function(err, database) {
        if (err) throw err;
        var database_collection = database.db("Packages_for_Demo");

        var keys_for_Dependencies = Object.keys(Dependencies);
        var values_for_Dependencies = Object.values(Dependencies);
        var keys_for_devDependencies = Object.keys(devDependencies);
        var values_for_devDependencies = Object.values(devDependencies);
      
      var dep = []
      for(let i = 0; i<keys_for_Dependencies.length; i++){
        dep.push({
          "DependenciesName": keys_for_Dependencies[i],
          "DependenciesVersion" : values_for_Dependencies[i]
      })
      }
    //   console.log(dep)
      
      var devdep = []
      for(let j = 0; j<keys_for_devDependencies.length; j++){
          devdep.push({
              "devDependenciesName": keys_for_devDependencies[j],
              "devDependenciesVersion" : values_for_devDependencies[j]
          })
      }
    //   console.log(devdep)
      
      Entire_package = dep.concat(devdep)
    //   console.log(Entire_package)
      
      database_collection.collection("Dependencies and devDependencies").insertMany(Entire_package, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        
      });

      database_collection.collection("Dependencies and devDependencies").find({}).toArray(function(err, result) {
        if (err) throw err;
        Whole_Package = result;
        // for(i of result) {
        //     Inserted_Dependencies = i.DependenciesName;
        //     Inserted_devDependencies = i.devDependenciesName;
        // }

        // console.log(Inserted_Dependencies)
        database.close();
    })
        
      });
}

