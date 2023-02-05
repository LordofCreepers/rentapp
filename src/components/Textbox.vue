<template>
	<input ref="input" type="text" @keydown="event => check( event )" @change="event => changed( event )">
</template>

<script>

export default {
	name: "Textbox",
	props: {
		default_value: {
			type: String,
			default: ""
		},
		filter: {
			type: Function,
			default: () => true
		}
	},
	data() {
		return {
			value: ""
		}
	},
	created() {
		this.value = this.default_value
	},
	methods: {
		check( event ) {
			if ( this.filter( event ) ) return;
			event.preventDefault()
		},
		changed( event ) {
			if ( this.value == event.target.value ) return;
			this.setValue( event.target.value )
			this.$emit( "change", this.value )
		},
		setValue( value ) {
			this.value = value
			this.$refs.input.setAttribute( "value", value )
		}
	},
	emits: [ "change" ]
}

</script>