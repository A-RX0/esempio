function write(){
    let strgJSON=JSON.stringify(dipendenti); 
    fs.writeFileSync('dipendentiJSON.txt', strgJSON); 
}

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var cors =require('cors'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var urlencodeJsonParser=bodyParser.json({ type: 'application/json' });
var app = express();
var dipendenti=[]; 
var count_id=1;
var json=""; 
var dipednentiJson={}; 
app.use(cors()); 

if(fs.existsSync("dipendentiJSON.txt")){
    json=fs.readFileSync('dipendentiJSON.txt'); 
    if(json!=""){
        dipednentiJson=JSON.parse(json); 
        if(dipednentiJson.length>0){
            for(let i=0; i<dipednentiJson.length; i++){
                dipendenti[i]=dipednentiJson[i]; 
            }
        }
    }
}

if(dipendenti.length>0){
    count_id=dipendenti[dipendenti.length-1].id++; 
}

app.get('/read/:id/get', urlencodedParser, function(req, res){
    let id=parseInt(req.params['id']); 
    let dipendente={}; 
    for(let i =0; i<dipendenti.length; i++){
        if(dipendenti[i].id == id){
            dipendente=dipendenti[i]; 
        } 
    }
    res.end(JSON.stringify(dipendente, null, 2)); 
}); 

app.get('/read/getAll', urlencodedParser, function(req, res){
    res.end(JSON.stringify(dipendenti, null, 2)); 
}); 

app.post('/insert', urlencodeJsonParser, function(req, res){
    let dipendente=req.body; 
    dipendente.id=count_id; 
    count_id++; 
    dipendenti.push(dipendente);
    let conferma="Inserimento eseguito"; 
    write(); 
    res.end(JSON.stringify(conferma, null, 2));  
    
}); 

app.put('/update', urlencodeJsonParser, function(req, res){
    let dipendente=req.body; 
    let indice=0; 
    for(let i =0; i<dipendenti.length; i++){
        if(dipendenti[i].id == dipendente.id){
            dipendenti[i] = dipendente; 
        //indice = i; 
            break;
            }
        } 
        write();
        let conferma="Aggiornamento eseguito"
        res.end(JSON.stringify(conferma, null, 2)); 

});

app.delete('/delete/:id', urlencodedParser, function(req, res){
    let id=parseInt(req.params['id']);
    let indice=0; 
    for(let i =0; i<dipendenti.length; i++){
        if(dipendenti[i].id == id){
            indice=i;  
        }
        } 
        dipendenti.splice(indice, 1); 
        let conferma="Eliminazione eseguita"; 
        write(); 
        res.end(JSON.stringify(conferma, null, 2)); 

}); 


app.listen(8070, function () {
    console.log('listening on port 8070.');
});
