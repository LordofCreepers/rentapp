<template>
	<div class="lr-log-record">
		<h4 class="lr-datetime">{{ date.toString() }}</h4>
		<div class="lr-container">
			<slot class="lr-slot">No message</slot>
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