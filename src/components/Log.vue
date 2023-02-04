
<template>
	<UnfoldingContainer title="Логи" class="log-unfold">
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
						<div v-else-if="message.table != undefined">
							<LogQueryTable 
								:name="message.table.name" 
								:columns="message.table.columns"
								:rows="message.table.rows"
							/>
							<button
								class="log-save-as"
								v-if="message.table.canSaveAsText != undefined && message.table.canSaveAsText"
								@click='$emit( "saveAs", "text" )'
							>
								<font-awesome-icon class="log-save-as save" icon="fa-solid fa-floppy-disk" /> Текст
							</button>
							<button 
								class="log-save-as"
								v-if="message.table.canSaveAsJSON != undefined && message.table.canSaveAsJSON"
								@click='$emit( "saveAs", "json" )'
							>
								<font-awesome-icon class="log-save-as save" icon="fa-solid fa-floppy-disk" /> JSON
							</button>
							<button 
								class="log-save-as"
								v-if="message.table.canSaveAsXML != undefined && message.table.canSaveAsXML"
								@click='$emit( "saveAs", "xml" )'
							>
								<font-awesome-icon class="log-save-as save" icon="fa-solid fa-floppy-disk" /> XML
							</button>
						</div>
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
	},
	emits: [ "saveAs" ]
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

	.lg-log-query-table {
		border-collapse: collapse;
		border-color: white;
		font: 12px Prompt-Medium;
	}
</style>