var express = require('express');
var app = express();

app.use('/', express.static('build'));
app.use('/search', express.static('build'));
app.use('/api/auth/check', express.static('build'));

app.listen(process.env.PORT || 3000);
