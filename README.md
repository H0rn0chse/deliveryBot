# deliveryBot

This discord bot fetches a website for you and checks whether a selector meets your expectations or not. If so it notifies you via the channel where you entered the start command. The selector and refresh interval is hardcoded for now but can be adjusted easily. The bot accepts multiple users, but only one lookup per user.

## Hardcoded details

+ selector: tr.success
+ timeout: 60 seconds

## Commands

All commands start with the prefix deliveryBot:

### start \<url\> \<count\>
Adds a lookup for your specific user to the routine.

### stop
Removes your lookup from the routine.

### clear
Removes all messages posted by the bot. This command only works for messages posted during runtime and does not affect older messages.

### status
Returns the latest status of your specific lookup.