<template>
	<table class="lq-log-query-table" border="1">
		<caption class="lg-caption">{{ name }}</caption>
		<tr class="lg-header row">
			<th class="lg-header column"
				v-for="column of columns"
				:key="column"
			>
				{{ column }}
			</th>
		</tr>
		<tr class="lg-content row"
			v-for="rows of rows"
			:key="rows"
		>
			<td class="lg-content column"
				v-for="row of rows"
				:key="row"
			>
				{{ row }}
			</td>
		</tr>
	</table>
</template>

<script>

export default {
	name: "LogQueryTable",
	props: {
		name: {
			type: String,
			required: true
		},
		columns: {
			type: Array,
			required: true
		},
		rows: {
			type: Array,
			required: true
		}
	}
}

</script>