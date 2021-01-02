/**
 * @name NamedAlready? -- A artist name search utility
 * 
 * @description A Artist name search utility, used for finding if a artist name is already being used.
 * 
 * @version 1.0.0
 * @copyright 2021 Suraj Goraya
 */

require('dotenv').config();

const SPOTIFY_API_KEY = process.env.SPOTIFY_API_KEY;

const got = require("got");
const client = got.extend({
    headers: {
        'Authorization': `Bearer ${SPOTIFY_API_KEY}`
    }
});

const readline = require("readline");
const chalk = require('chalk');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const terminalImage = require('terminal-image');

console.log(chalk`{white.dim -----------------} {white.bold NamedAlready?} | {magenta.italic v 1.0.0} {white.dim -----------------} `)

rl.question("Enter desired artist name? ", function (name) {
    console.log(`Searching for ${name}`);
    getArist(name);
    rl.close();
});

/**
 * @description This function will return an image from the spotify api to display in the terminal.
 * @requires process.env.SHOWIMG To be 'true'
 * @param {Array} images - Array of images from the Spotify API 
 */
async function getImage(images) {
    if (images && images.length && process.env.SHOWIMG == true) {
        let url = images[0].url;
        const body = await got(url).buffer();
        return body;
    } else {
        return null;
    }
}

/**
 * @description Uses the Spotify API to get a list of artists and display them to the user.
 * @param {string} name 
 */
async function getArist(name) {

    let res = await client(`https://api.spotify.com/v1/search?q="${name}"&type=artist`);
    let parsed = JSON.parse(res.body);

    console.log(chalk`{white.dim Found ${parsed.artists.total}}\n\n`);
    if (parsed.artists.items) {
        parsed.artists.items.forEach(async artist => {
            let body = await getImage(artist.images)
            console.log(chalk`${body ? await terminalImage.buffer(body, { width: '5%', height: '5%', preserveAspectRatio: true }) : ""}\n{white.bold ${artist.name}} {magenta.underline ${artist.external_urls.spotify}} {grey.dim ${artist.genres}} `)
        })
    }
} 
