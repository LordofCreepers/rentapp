
<template>
	<UnfoldingContainer title="Логи" class="log-unfold">
		<div class="log">
			<button @click="clear()" class="log-clear">Очистить</button>
			<div class="log-container" v-if="messages.length > 0">
				<LogRecord 
					v-for="message of messages"
					:key="message.text"
					:datetime="( message.datetime != undefined ) ? message.datetime : new Date( Date.now() )"
				>
					{{ message.text }}
				</LogRecord>
			</div>
			<div class="log-container empty" v-else></div>
		</div>
	</UnfoldingContainer>
</template>

<script>
import LogRecord from "./LogRecord.vue";
import UnfoldingContainer from "./UnfoldingContainer.vue";

export default {
	name: "Log",
	components: {
		LogRecord,
		UnfoldingContainer
	},
	data() {
		return {
			messages: [ 
				{
					text: "Сообщение"
				},
				{
					text: "Ещё одно сообщение"
				},
				{
					text: "Другое сообщение",
					datetime: new Date( "1995-12-17T03:24:00" )
				}
			]
		}
	},
	methods: {
		clear() {
			this.messages = []
		},
		add( msg ) {
			this.messages.push( msg )
		}
	}
}

</script>

<style>
	.log {
		padding-left: 7.5%;
		padding-right: 7.5%;
		border: 1px solid black;
		border-radius: 8px;
	}

	.log-header {
		display: flex;
	}

	.log-clear {
		margin-top: 1%;
		margin-bottom: 1%;
		background-color: black;
		border-radius: 4px;
		border: none;
		color: white;
		width: 20%;
		height: 5vh;
	}

	.log-container {
		background-color: black;
		border-radius: 4px;
		color: white;
		margin-bottom: 2.5%;
		padding-bottom: 1%;
		padding-top: 1%;
	}

	.log-container.empty {
		height: 5vh;
	}
</style>