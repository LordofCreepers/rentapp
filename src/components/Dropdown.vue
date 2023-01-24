<template>
	<select ref="select" @change="event => changed( event )">
		<option v-for="option in options" :key="option">{{ option }}</option>
	</select>
</template>

<script>

export default {
	name: "Dropdown",
	props: {
		options: {
			type: Array,
			required: true
		},
		default: String
	},
	data() {
		return {
			value: this.default
		}
	},
	mounted() {
		if ( this.value == undefined ) return;
		for ( const option of this.$refs.select.childNodes ) {
			if ( this.value != option.text ) continue
			option.setAttribute( "selected", true )
			break
		}
		console.log( this.options )
	},
	methods: {
		changed( event ) {
			this.value = event.target.options[ event.target.selectedIndex ].text
			this.$emit( "change", this.value )
		}
	},
	emits: [ "change" ]
}

</script>