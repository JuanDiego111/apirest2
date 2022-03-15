const express= require('express')
const app= express()
const mysql= require('mysql2')

var pool= mysql.createPool({
    connectionLimit:20,
    host: 'localhost',
      user: 'root',
      password: 'Xeraton246810',
      database: 'videojuegos'
  })
  
app.get("/api/videojuegos", function(pet,res){
    pool.getConnection(function(err,connec){
        const query=`SELECT * FROM juegos`
        console.log(query)
        connec.query(query, function(err,filas,campos){
            res.json({data: filas})
        })
        connec.release()
    })

})
app.get("/api/videojuegos/:id", function(pet,res){
    pool.getConnection(function(err,connec){
        const query=`SELECT * FROM juegos WHERE id=${connec.escape(pet.params.id)}`
        connec.query(query, function(err,filas,campos){
           if (filas.length > 0){ 
            
            res.json({data: filas[0]})
           }
           else{
            res.status(404)
            res.send({error: ["No se encuentra esa tarea"]})
           }
        })
        connec.release()
})

})

app.post('/api/videojuegos/', function(pet,res){
    pool.getConnection(function(err,connec){
        const query=`INSERT INTO juegos (nombre,puntos,niveles) VALUES (NULL,${connec.escape(pet.body.nombre)},
        ${connec.escape(pet.body.puntos)},${connec.escape(pet.body.niveles)})`
        console.log(query)
        connec.query(query, function(error,filas,campos){
            const nuevoId=filas.insertId
            const queryConsulta = `SELECT * FROM juegos WHERE id=${connec.escape(nuevoId)}`
            connec.query(queryConsulta, function(error,filas,campos){
              res.status(201)
              res.json({data: filas[0]})  
            })
        })
      
        connec.release()
})


})

app.put("/api/videojuegos/:id", function(pet,res){
    pool.getConnection(function(err,connec){
        const query=`SELECT * FROM juegos WHERE id=${connec.escape(pet.params.id)}`
        connec.query(query, function(err,filas,campos){
           if (filas.length > 0){ 
            const queryUpdate= `UPDATE juegos SET nombre=${connec.escape(pet.body.nombre)}, puntos=${connec.escape(pet.body.puntos)}, niveles=${connec.escape(pet.body.niveles)} WHERE id=${pet.params.id}`
            connec.query(queryUpdate, function(error,filas,campos){
                const queryConsulta=`SELECT * FROM juegos WHERE id=${connec.escape(pet.params.id)}`
                connec.query(queryConsulta, function(error, filas, campos)
                {res.json({data:filas[0]})
            })

            })
           
                                }
           else{
            res.status(404)
            res.send({error: ["No se encuentra esa tarea"]})
           }
        })
        connec.release()
})

})


app.delete("/api/videojuegos/:id", function(pet,res){
    pool.getConnection(function(err,connec){
        const query=`SELECT * FROM juegos WHERE id=${connec.escape(pet.params.id)}`
        connec.query(query, function(error,filas,campos){
           if (filas.length > 0){ 
            const queryDelete= `DELETE FROM juegos  WHERE id=${pet.params.id}`
            connec.query(queryDelete, function(error,filas,campos){
                res.status(204)
                res.json()

            })
           
                                }
           else{
            res.status(404)
            res.send({error: ["No se encuentra esa tarea"]})
           }
        })
        connec.release()
})

})

app.get("/", function(pet,res){
    res.render('index')
})

  app.listen(8080, function(){
      console.log("Iniciando infección")
  })