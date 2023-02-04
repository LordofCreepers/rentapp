<template>
	<button 
		ref="file" 
		:class='[ "tf-file", this.value === null ? "empty" : "" ]'
		@click="clicked()"
	>
		{{ value === null ? "Загрузить файл" : file_path }}
	</button>
</template>

<script>

export default {
	name: "File",
	props: {
		accept_types: {
			type: Array,
			default: () => { [] }
		}
	},
	data() {
		return {
			value: null,
			file_path: ""
		}
	},
	methods: {
		async clicked() {
			const result = await window.file_api.prompt_upload([{
				name: "Image",
				extensions: this.accept_types
			}])
			if ( !result.status.ok ) return

			let path = result.path.split( "\\" )
			path = path[ path.length - 1 ]
			this.file_path = path
			this.setValue( result.file )
		},
		async setValue( file ) {
			this.value = file
			this.$emit( "change", this.value )
		}
	},
	emits: [ "change" ]
}

</script>