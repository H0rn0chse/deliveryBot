const discordHelper = require("./discordHelper")

module.exports = {
	start: function (message) {
		const userId = message.author.id
		const channel = message.channel

		// entry does not exist
		if (!global.userList[userId]) {
			let args = message.content.split(" ")

			const user = {
				url: args[2],
				targetCount: parseInt(args[3], 10),
				channel: channel,
				userId: userId,
				result: {
					output: "",
					timestamp: ""
				}
			}
			if (!isNaN(user.targetCount)) {
				global.userList[userId] = user

				discordHelper.send(channel, "started processing your lookup", 5)
			}
		} else {
			discordHelper.send(channel, "you can only have one lookup, please delete your existing one with: \"deliveryBot stop\"", 5)
		}
	},
	stop: function (message) {
		const userId = message.author.id
		const channel = message.channel

		if (global.userList[userId]) {

			delete global.userList[userId]

			discordHelper.send(channel, "stopped processing your lookup", 5)
		} else {
			discordHelper.send(channel, "you dont have any running lookups", 5)
		}
		
	},
	clear: function () {
		handledMessages = global.messages;
		handledMessages.forEach(message => {
			message.delete()
		})
		global.messages = [];
	},
	status: function (message) {
		const userId = message.author.id
		const channel = message.channel

		if (global.userList[userId]) {

			const result = global.userList[userId].result;

			discordHelper.send(channel, `The result of the latest fetch (${result.timestamp}): ${result.output}`, 8)
			
		} else {
			discordHelper.send(channel, "you dont have any running lookups", 5)
		}
	}
}