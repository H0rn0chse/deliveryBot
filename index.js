require('dotenv').config()

const got = require('got')
const cheerio = require('cheerio')
const dateFormat = require('dateformat')
const Discord = require('discord.js')
const client = new Discord.Client()

const commands = require("./scripts/commands")
const discordHelper = require("./scripts/discordHelper")

global.userList = {}
global.messages = []
const timeout = 60

client.login(process.env.CLIENT_TOKEN)

client.once('ready', () => {
	console.log("ready")

	// message handling
	client.on('message', message => {
		const channel = message.channel

		// ignore dms
		if (message.guild !== null) {
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
		}
	})

	// working loop
	setInterval(doWork, timeout * 1000)
})

function doWork () {
	Object.values(global.userList).forEach(user => {

		got(user.url)
			.then(response => {
				const $ = cheerio.load(response.body)

				if (selectorMatches($, user)) {
					discordHelper.send(user.channel, `<@${user.userId}> Paket kommt an`)
				}
			}).catch(error => {
				console.log(error)
				delete global.userList[user.userId]
			})
	})
}

function selectorMatches ($, user) {
	const count = $("tr.success").length
	user.result = {
		timestamp: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
		output: `${count}/${user.targetCount}`
	}
	return count === user.targetCount
}