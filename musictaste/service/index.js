/*const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));


const express = require('express');
const app = express();

app.listen(8080);*/

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});