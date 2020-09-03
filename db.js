// what to store as metadata for slippi files in database
// url
// original file name
// data type:
//    application/slippi
// long description
// date added

// tournament info to store
// creation date
// randomized name (customizable)
// bracket_urlsmash.gg url
// id

const create_str =
  '' +
  `CREATE TABLE tournament(
   id SERIAL NOT NULL PRIMARY KEY,
   name           TEXT    NOT NULL DEFAULT '',
   bracket_url    TEXT    NOT NULL DEFAULT '',
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const dotenv = require('dotenv');
dotenv.config();

const { Pool, Client } = require('pg');

const client = new Client({
  connectionString : process.env.DATABASE_URL,
  ssl              : {
    rejectUnauthorized : false
  }
});
client.connect();

function new_tournament(name = 'none', url = 'https://smash.gg') {
  const text =
    'INSERT INTO tournament(name, bracket_url) VALUES($1, $2) RETURNING *';
  const values = [ name, url ];

  client
    .query(text, values)
    .then((res) => {
      console.log(res.rows[0]);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    })
    .catch((e) => console.error(e.stack));
}

function update_tournament(id, key, val) {
  const text = `UPDATE tournament
        SET ${key} = '${val}'
        WHERE id = ${id}
        RETURNING *;`;
  const values = [];

  client
    .query(text, values)
    .then((res) => {
      console.log(res.rows[0]);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    })
    .catch((e) => console.error(e.stack));
}

new_tournament();
update_tournament(1, 'name', 'ponguuuuuuuuuuuus');
// client.end();