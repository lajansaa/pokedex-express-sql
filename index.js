const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const { Client } = require('pg');
/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set handlebars to be the default view engine
app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');


/**
 * ===================================
 * Routes
 * ===================================
 */
app.get('/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('new');
});

app.get('/:id/edit', (request, response) => {
  // Initialise postgres client
  let client = new Client({
    user: 'Isa',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });
  let pokemonObj = {};
  let searchID = request.params.id;

  client.connect((err) => {
    queryString = "SELECT * FROM pokemon WHERE id = $1;";
    value = [searchID];
    client.query(queryString, value, (err, result) => {
      pokemonObj["pokemon"] = result.rows[0];
      response.render('edit', pokemonObj);
      client.end();
    })
  })
});

app.get('/:id', (request, response) => {
  // Initialise postgres client
  let client = new Client({
    user: 'Isa',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });
  let pokemonObj = {};
  let searchID = request.params.id;

  client.connect((err) => {
    queryString = "SELECT * FROM pokemon WHERE id = $1;";
    value = [searchID];
    client.query(queryString, value, (err, result) => {
      pokemonObj["pokemon"] = result.rows[0];
      response.render('pokemon', pokemonObj);
      client.end();
    })
  })
});

app.get('/', (request, response) => {
  // Initialise postgres client
  let client = new Client({
    user: 'Isa',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });
  let pokemonObj = {"pokemon": []};

  // query database for all pokemon
  client.connect((err) => {
    queryString = 'SELECT * FROM pokemon;'
    client.query(queryString, (err, result) => {
      result.rows.forEach((pokemon) => {
        pokemonObj.pokemon.push(pokemon);
      });
      // respond with HTML page displaying all pokemon
      response.render('home', pokemonObj);
      client.end();
    })
  })
});

app.post('/', (req, response) => {
  // Initialise postgres client
  let client = new Client({
    user: 'Isa',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });
  let params = req.body;

  const queryString = "INSERT INTO pokemon(name, img, height, weight) VALUES($1, $2, $3, $4);"
  const values = [params.name, params.img, params.height, params.weight];

  client.connect((err) => {
    client.query(queryString, values, (err, res) => {
      response.redirect('/');
      client.end();
    });
  });
});

app.put('/:id', (req, response) => {
  // Initialise postgres client
  let client = new Client({
    user: 'Isa',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });
  let params = req.body;

  const queryString = "UPDATE pokemon SET name=$1, img=$2, height=$3, weight=$4;"
  const values = [params.name, params.img, params.height, params.weight];

  client.connect((err) => {
    client.query(queryString, values, (err, res) => {
      response.redirect('/' + params.id);
      client.end();
    });
  });
});

app.delete('/:id', (req, response) => {
  // Initialise postgres client
  let client = new Client({
    user: 'Isa',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });
  let params = req.body;

  const queryString = "DELETE FROM pokemon WHERE id = $1;"
  const values = [params.id];

  client.connect((err) => {
    client.query(queryString, values, (err, res) => {
      response.redirect('/');
      client.end();
    });
  });
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
