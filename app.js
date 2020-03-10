const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs')

const uri = '';

async function createApp() {

    async function getUsers() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const usersCollection = client.db('dashboard').collection('users');
        const users = await usersCollection.find({}).toArray();
        client.close();
        return users;
    }

    async function getCompetitions() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const competitionsCollection = client.db('dashboard').collection('competitions');
        const competitions = await competitionsCollection.find({}).toArray();
        client.close();
        return competitions;
    }

    async function getTenders() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const tendersCollection = client.db('dashboard').collection('tenders');
        const tenders = await tendersCollection.find({}).toArray();
        client.close();
        return tenders;
    }

    async function getFreelanceProjects() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const freelanceCollection = client.db('dashboard').collection('freelanceprojects');
        const freelanceProjects = await freelanceCollection.find({}).toArray()
        client.close();
        return freelanceProjects;
    }

    async function getClientProjects() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const clientProjectsCollection = client.db('dashboard').collection('clientprojects');
        const clientProjects = await clientProjectsCollection.find({}).toArray()
        client.close();
        return clientProjects;
    }

    async function queryWholeDatabase() {
        const wholeDatabase = {};
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const clientProjectsCollection = client.db('dashboard').collection('clientprojects');
        const clientProjects = await clientProjectsCollection.find({}).toArray()
        wholeDatabase.clientProjects = clientProjects;
        const usersCollection = client.db('dashboard').collection('users');
        const users = await usersCollection.find({}).toArray();
        wholeDatabase.users = users;
        const competitionsCollection = client.db('dashboard').collection('competitions');
        const competitions = await competitionsCollection.find({}).toArray();
        wholeDatabase.competitions = competitions;
        client.close();
        return wholeDatabase;
    }

    app.use(express.static(__dirname + '/public'));

    app.get('/', (req, res) => {
        const resolveDatabase = Promise.resolve(queryWholeDatabase());
        resolveDatabase.then(function(wholeDatabase) {
            fs.readFile(__dirname + '/index.html', 'utf-8', (err, html) => {
                res.send(ejs.render(html, { info: wholeDatabase }))
            })
        })
    })

    app.get('/users', (req, res) => {
        const resolveDatabase = Promise.resolve(getUsers());
        resolveDatabase.then(function(data) {
            fs.readFile(__dirname + '/users.html', 'utf-8', (err, html) => {
                res.send(ejs.render(html, { info: data }))
            })
        })
    })

    app.get('/competitions', (req, res) => {
        const resolveDatabase = Promise.resolve(getCompetitions());
        resolveDatabase.then(function(data) {
            fs.readFile(__dirname + '/competitions.html', 'utf-8', (err, html) => {
                res.send(ejs.render(html, { info: data }))
            })
        })
    })

    app.get('/tenders', (req, res) => {
        const resolveDatabase = Promise.resolve(getTenders());
        resolveDatabase.then(function(data) {
            fs.readFile(__dirname + '/tenders.html', 'utf-8', (err, html) => {
                res.send(ejs.render(html, { info: data }))
            })
        })
    })

    app.get('/freelanceProjects', (req, res) => {
        const resolveDatabase = Promise.resolve(getFreelanceProjects());
        resolveDatabase.then(function(data) {
            fs.readFile(__dirname + '/freelanceProjects.html', 'utf-8', (err, html) => {
                res.send(ejs.render(html, { info: data }))
            })
        })
    })

    app.get('/clientProjects', (req, res) => {
        const resolveDatabase = Promise.resolve(getClientProjects());
        resolveDatabase.then(function(data) {
            fs.readFile(__dirname + '/clientProjects.html', 'utf-8', (err, html) => {
                res.send(ejs.render(html, { info: data }))
            })
        })
    })

    app.listen(3000);
    console.log('listening to app 3000');
}

async function main() {
    await createApp();
}

main();
