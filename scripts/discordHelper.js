module.exports = {
	send: function (channel, message, timeout) {
		return channel.send(message)
			.then(message => {
				if (timeout) {
					message.delete({timeout: timeout * 1000})
						.then(() => {
							// message was deleted
						})
						.catch(() => {
							// message could not be deleted
						})
				} else if (timeout !== false) {
					global.messages.push(message)
				}
			})
	},
	dm: function (user, msg) {
		return user.createDM()
			.then(channel => {
				return this.send(channel, msg, false)
			})
	},
	argError: "You entered the wrong amount of items or the wrong format"
}