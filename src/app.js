const path = require ('path');
const express = require ('express');
const hbs = require ('hbs');

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express ();

const port = process.env.PORT || 3000 ; 

const publicDirectoryPath = path.join(__dirname, '../public');
const viwsPath = path.join(__dirname, '../templates/views')

const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine','hbs')
app.set('views', viwsPath )
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath));

app.get('' , (req , res ) =>{
    res.render('index',{
        title: 'Weather app', 
        name: 'Gustavo Rodriguez'
    })
})


app.get('/about', (req , res)=>{
    res.render('about', {
        title: 'About', 
        name: 'gustavo rodriguez '
    })
})

app.get('/help', (req , res)=>{
    res.render('help', {
        helpText: 'This is some helpful text' , 
        title:'Help', 
        name : 'Gustavo Rodriguez'
    })
})


/*
app.get ('' , (req , res) => {
    res.send('Hello express!');
});

app.get ('/help', (req, res)=>{
    res.send({
        name: 'gustavo', 
        age: 38
    })
})

app.get ('/about', (req, res)=>{
    res.send('<h1>About page</h1>')
})
*/
app.get ('/weather', (req, res)=>{
    
    if (!req.query.address){
        return res.send({
            error :'You have not entered the address'
        })
    }
    
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
          
            res.send({
                forecast : forecastData, 
                location : location, 
                address: req.query.address
            }) 


        })
    })

})




app.get('/products',( req , res )=>{
    
    if (!req.query.search){
        return res.send({
            error :'You must provide a search term: search=games&rating=5 '
        })
    }
    
    res.send({
        products : []
    })
})


app.get ('*', (req , res )=>{
    res.render('page404',{
        title : 'Page 404', 
        name: 'gustavo Rodriguez',
        errorMessage: 'Page not found'
    })
})


app.listen ( port , ()=>{
    console.log('Server is up on port ' + port   );
})