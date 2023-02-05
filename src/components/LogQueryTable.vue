<template>
	<div>
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
				<td :class="[ 'lg-content column', row !== null ? '' : 'null' ]"
					v-for="row of rows"
					:key="row"
				>
					{{ row !== null ? row : "Нет данных" }}
				</td>
			</tr>
		</table>
		<div class="lq-save-buttons">
			<button
				class="lq-save-as"
				v-for="extension of extensions"
				:key="extension.name_short"
				@click="save_as( extension )"
			>
				<font-awesome-icon class="lq-save-as-icon" icon="fa-solid fa-floppy-disk" /> {{ extension.name_short }}
			</button>
		</div>
	</div>
</template>

<script>

function CopyArray( arr ) {
	let arr_copy = []
	for ( const value of arr ) {
		arr_copy.push( value )
	}

	return arr_copy
}

function CopyObject( obj ) {
	let obj_copy = {}
	for ( const key in obj ) {
		const value = obj[ key ]
		if ( typeof value === "object" ) {
			if ( Array.isArray( value ) )
				obj_copy[ key ] = CopyArray( value )
			else
				obj_copy[ key ] = CopyObject( value )
		}
		else
			obj_copy[ key ] = value
	}

	return obj_copy
}

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
		},
		extensions: {
			type: Array,
			default: () => { [] }
		}
	},
	methods: {
		save_as( format ) {
			window.file_api.prompt_save_result( structuredClone({
				format: format,
				name: this.name,
				columns: this.columns.slice(),
				rows: this.rows.slice()
			}))
		}
	}
}

</script>