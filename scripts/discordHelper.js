module.exports = {
	send: function (channel, message, timeout) {
		return channel.send(message)
			.then(message => {
				if (timeout) {
					message.delete({timeout: timeout * 1000})
				} else {
					global.messages.push(message)
				}
			})
	}
}