<template>
	<Textbox ref="textbox" :filter="event => is_number( event )" @change="value => changed( value )" />
</template>

<script>
import Textbox from './Textbox.vue'

export default {
	name: "Numberbox",
	components: {
		Textbox,
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
		is_number( event ) {
			let result = false
			for ( let k = 0; k < 10; k++ ) {
				if ( event.key == k ) {
					result = true
					break
				}
			}

			return ( result || 
				( event.key == '.' && !event.target.value.includes( '.' ) ) || 
				event.key == 'Backspace' || 
				event.key == 'Home' ||
				event.key == 'End' ||
				event.key == 'ArrowLeft' ||
				event.key == 'ArrowRight'
			) && this.filter( event )
		},
		changed( value ) {
			if ( this.min != undefined && value < this.min )
				value = this.min
			if ( this.max != undefined && value > this.max )
				value = this.max
			this.setValue( value )
			this.$emit( "change", this.value )
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