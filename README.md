# deliveryBot

With this bot you can fetch a website and check if a selector meets your expectations. The selector and refresh interval is hardcoded for now but can be adjusted easily. The bot accepts multiple users, but only one lookup per user.

## Hardcoded details

+ selector: tr.success
+ timeout: 60 seconds

## Commands

All commands start with the prefix deliveryBot:

### start \<url\> \<times\>
Adds a lookup for your specific user

### stop
Removes your lookup

### clear
Removes all messages posted by the bot. This command only works for messages posted during runtime and does not affect older messages.

### status
Returns the latest status of your lookup