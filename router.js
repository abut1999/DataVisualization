const express = require('express');
const router = express.Router()
const fs = require('fs');
const ejs = require('ejs')
const path = require('path');

const databaseController = require('./databaseController')

router.use(express.static(__dirname + '/public'));

router.post('/auth', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    const resolveDatabase = Promise.resolve(databaseController.getAllowedUsers());
    resolveDatabase.then(function (users) {
      if (users.filter(e => e.username == username).length > 0 && users.filter(e => e.password == password).length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/index');
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/login.html'));
});

router.get('/index', (req, res) => {
  if (req.session.loggedin) {
    const resolveDatabase = Promise.resolve(databaseController.queryWholeDatabase());
    resolveDatabase.then(function (wholeDatabase) {
      fs.readFile(__dirname + '/views/index.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { info: wholeDatabase }))
      })
    });
  } else {
    res.redirect('/');
  }
});

router.get('/users', (req, res) => {
  if (req.session.loggedin) {
    const resolveDatabase = Promise.resolve(databaseController.getUsers());
    resolveDatabase.then(function (users) {
      fs.readFile(__dirname + '/views/users.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { info: users }))
      })
    });
  } else {
    res.redirect('/');
  }
});

router.get('/competitions', (req, res) => {
  if (req.session.loggedin) {
    const resolveDatabase = Promise.resolve(databaseController.getCompetitions());
    resolveDatabase.then(function (competitions) {
      fs.readFile(__dirname + '/views/competitions.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { info: competitions }))
      })
    });
  } else {
    res.redirect('/');
  }
});

router.get('/tenders', (req, res) => {
  if (req.session.loggedin) {
    const resolveDatabase = Promise.resolve(databaseController.getTenders());
    resolveDatabase.then(function (tenders) {
      fs.readFile(__dirname + '/views/tenders.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { info: tenders }))
      })
    });
  } else {
    res.redirect('/');
  }
});

router.get('/freelanceProjects', (req, res) => {
  if (req.session.loggedin) {
    const resolveDatabase = Promise.resolve(databaseController.getFreelanceProjects());
    resolveDatabase.then(function (freelanceProjects) {
      fs.readFile(__dirname + '/views/freelanceProjects.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { info: freelanceProjects }))
      })
    });
  } else {
    res.redirect('/');
  }
});

router.get('/clientProjects', (req, res) => {
  if (req.session.loggedin) {
    const resolveDatabase = Promise.resolve(databaseController.getClientProjects());
    resolveDatabase.then(function (clientProjects) {
      fs.readFile(__dirname + '/views/clientProjects.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { info: clientProjects }))
      })
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
