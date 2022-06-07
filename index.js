require('dotenv').config()

const got = require('got')
const cheerio = require('cheerio')
const dateFormat = require('dateformat')
const Discord = require('discord.js')
global.client = new Discord.Client()

const commands = require("./scripts/commands")
const discordHelper = require("./scripts/discordHelper")

global.userList = {}
global.messages = []
global.timeout = 10 * 60

global.client.login(process.env.CLIENT_TOKEN)

global.client.once('ready', () => {
	console.log("ready")

	// message handling
	global.client.on('message', message => {
		const channel = message.channel

		// ignore dms
		if (!message.guild) {
			return;
		}

		if (message.content.startsWith("deliveryBot")) {
			let args = message.content.split(" ")

			if (commands[args[1]]) {
				commands[args[1]](message)
			} else {
				discordHelper.send(channel, "command does not exist", 5)
			}

			message.delete({timeout: 1000})
				.then(() => {
					// message was deleted
				})
				.catch(() => {
					// message could not be deleted
				})
		}
	})

	// working loop
	setInterval(doWork, global.timeout * 1000)
})

function doWork () {
	Object.values(global.userList).forEach(entry => {

		got(entry.url)
			.then(response => {
				const $ = cheerio.load(response.body)

				if (selectorMatches($, entry)) {
					discordHelper.send(entry.channel, `<@${entry.user.id}> Paket kommt an`)
				}
			}).catch(error => {
				console.log(error)

				if (error instanceof TypeError) {
					discordHelper.dm(entry.user, "Your lookup was removed, due to a malformed url")
						.then(() =>{
							delete global.userList[entry.user.id]
						})
				} else if (error instanceof got.HTTPError) {
					discordHelper.dm(entry.user, "Your lookup was removed, due to network issues")
						.then(() =>{
							delete global.userList[entry.user.id]
						})
				} else {
					discordHelper.dm(entry.user, `Your lookup was removed, due to a unknown error: ${error.name}`)
						.then(() =>{
							delete global.userList[entry.user.id]
						})
				}
			})
	})
}

function selectorMatches ($, entry) {
	const selector = entry.selector || ".status.text-primary";
	const count = $(selector).length
	entry.result = {
		timestamp: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
		output: `${count}/${entry.targetCount}`
	}
	return count === entry.targetCount
}