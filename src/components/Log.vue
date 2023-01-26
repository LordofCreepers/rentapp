
<template>
	<div class="log">
		<h3 class="log-title">Логи</h3>
		<div class="log-container">
			<LogRecord 
				v-for="message of messages"
				:key="message.text"
				:datetime="( message.date != undefined ) ? message.date : new Date( Date.now() )"
			>
				{{ message.text }}
			</LogRecord>
		</div>
		<button class="log-clear">Очистить</button>
	</div>
</template>

<script>
import LogRecord from "./LogRecord.vue";

export default {
	name: "Log",
	components: {
		LogRecord
	},
	data() {
		return {
			messages: [ 
				{
					text: "One message"
				},
				{
					text: "Another message"
				},
				{
					text: "Message from the past",
					datetime: new Date( "1995-12-17T03:24:00" )
				}
			]
		}
	}
}

</script>

<style>
	.log {
		margin-top: 10%;
	}
</style>