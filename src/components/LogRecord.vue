<template>
	<div class="lr-log-record">
		<h4 class="lr-datetime">{{ date.toString() }} </h4>
		<div class="lr-container">
			<slot>No message</slot>
		</div>
	</div>
</template>

<script>

export default {
	name: "LogRecord",
	props: {
		date: {
			type: Date,
			default: new Date()
		}
	}
}

</script>

<style>
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
</style>