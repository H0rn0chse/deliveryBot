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
				} else {
					global.messages.push(message)
				}
			})
	},
	argError: "You entered the wrong amount of items or the wrong format"
}