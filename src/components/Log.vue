
<template>
	<UnfoldingContainer title="Логи" class="log-unfold" ref="unfolding">
		<div class="log">
			<button @click="clear()" class="log-clear">Очистить</button>
			<div class="log-container" v-if="messages.length > 0">
				<LogRecord 
					v-for="message_collection of messages"
					:key="JSON.stringify( message_collection )"
					:datetime="( message_collection.datetime != undefined ) ? message_collection.datetime : new Date( Date.now() )"
				>
					<div v-for="message of message_collection.messages"
						:key="JSON.stringify( message )"
					>
						<div v-if="message.text != undefined">
							{{ message.text }}
						</div>
						<LogQueryTable v-else-if="message.table != undefined"
							:name="message.table.name" 
							:columns="message.table.columns"
							:rows="message.table.rows"
							:extensions="message.table.extensions"
						/>
					</div>
				</LogRecord>
			</div>
			<div v-else class="log-container empty"></div>
		</div>
	</UnfoldingContainer>
</template>

<script>
import LogQueryTable from "./LogQueryTable.vue";
import LogRecord from "./LogRecord.vue";
import UnfoldingContainer from "./UnfoldingContainer.vue";

export default {
	name: "Log",
	components: {
    LogRecord,
    UnfoldingContainer,
    LogQueryTable
},
	data() {
		return {
			messages: []
		}
	},
	methods: {
		clear() {
			this.messages = []
		},
		add( msg ) {
			console.log( msg )
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
		background: linear-gradient(160deg, #000 85%, rgba(44,62,80,1) 100%);
		background-size: 1000% 100%;
		margin-top: 1%;
		margin-bottom: 1%;
		border-radius: 4px;
		border: none;
		color: white;
		width: 20%;
		height: 5vh;
		transition-property: background;
		transition-duration: 250ms;
	}

	.log-clear:hover {
		background-position-x: 100%;
	}

	.log-container {
		background-color: black;
		border-radius: 4px;
		color: white;
		margin-bottom: 2.5%;
		padding-bottom: 1%;
		padding-top: 1%;
		align-items: center;
	}

	.log-container.empty {
		height: 2vh;
	}

	.lr-log-record {
		text-align: left;
	}

	.lr-datetime {
		font: 12px Prompt-Medium;
		margin-top: 1%;
		margin-bottom: 0%;
		margin-left: 0.5%;
	}

	.lr-container {
		margin-left: 1%;
		margin-right: 1%;
		margin-bottom: 0%;
		border-top: 1px solid white;
		padding: 1%;
		font: 16px Prompt-Medium;
	}

	.lq-log-query-table {
		width: 80%;
		margin: auto;
		border-collapse: collapse;
		border-color: white;
		font: 12px Prompt-Medium;
	}

	.lq-save-buttons {
		display: flex;
		justify-content: center;
		margin-top: 0.5%;
	}

	.lq-save-as {
		background-color: black;
		border: 1px solid white;
		border-radius: 4px;
		color: white;
	}

	.lq-save-as:hover {
		background-color: white;
		color: black;
	}

	.lq-save-as:active {
		background-color: black;
		color: white;
	}

	.lq-content.column.null {
		text-decoration: dotted;
		color: grey;
	}
</style>