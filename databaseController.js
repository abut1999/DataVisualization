const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_URI;

module.exports = {
    getAllowedUsers: async function getAllowedUsers() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const allowedUsersCollection = client.db('dashboard').collection('analyticUsers');
        const allowedUsers = await allowedUsersCollection.find({}).toArray();
        client.close();
        return allowedUsers;
    },
    queryWholeDatabase: async function queryWholeDatabase() {
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
    },
    getUsers: async function getUsers() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const usersCollection = client.db('dashboard').collection('users');
        const users = await usersCollection.find({}).toArray();
        client.close();
        return users;
    },
    getCompetitions: async function getCompetitions() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const competitionsCollection = client.db('dashboard').collection('competitions');
        const competitions = await competitionsCollection.find({}).toArray();
        client.close();
        return competitions;
    },
    getTenders: async function getTenders() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const tendersCollection = client.db('dashboard').collection('tenders');
        const tenders = await tendersCollection.find({}).toArray();
        client.close();
        return tenders;
    },
    getFreelanceProjects: async function getFreelanceProjects() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const freelanceCollection = client.db('dashboard').collection('freelanceprojects');
        const freelanceProjects = await freelanceCollection.find({}).toArray()
        client.close();
        return freelanceProjects;
    },
    getClientProjects: async function getClientProjects() {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const clientProjectsCollection = client.db('dashboard').collection('clientprojects');
        const clientProjects = await clientProjectsCollection.find({}).toArray()
        client.close();
        return clientProjects;
    }
}