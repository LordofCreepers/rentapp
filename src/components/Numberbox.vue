<template>
	<Textbox ref="textbox" :filter="( event ) => { 
		for ( let k = 0; k < 10; k++ )
			if ( event.key != k ) return false
		return event.key == '.' && this.filter( event )
	}" @change="change( value )" />
</template>

<script>
import Textbox from './Textbox.vue'

export default {
	name: "Numberbox",
	components: {
		Textbox
	},
	props: {
		default_value: {
			type: Number,
			default: 0
		},
		min: Number,
		max: Number,
		filter: {
			type: Function,
			default: () => true
		}
	},
	methods: {
		changed( event ) {
			let value = event.target.value
			if ( this.min != undefined && value < this.min )
				value = min
			if ( this.max != undefined && value > this.max )
				value = max
			this.setValue( value )
			this.$emit( "change", value )
		},
		setValue( value ) {
			if ( value == this.value ) return;
			if ( typeof Number( value ) != "number" )
			{
				this.setValue( 0 )
				return
			}
			this.value = value
			this.$refs.textbox.setValue( value )
		}
	},
	emits: [ "change" ]
}

</script>