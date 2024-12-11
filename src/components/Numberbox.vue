<template>
	<Textbox v-if="!is_select" ref="textbox" :is_select="false" :filter="event => is_number( event )" @change="value => changed( value )" />
	<div class="number-range-container" v-else>
		<h6 class="number-desc">Мин: </h6>
		<Textbox :class="$attrs.class" ref="textbox_min" :is_select="false" :filter="event => is_number( event )" />
		<h6 class="number-desc">Макс: </h6>
		<Textbox :class="$attrs.class" ref="textbox_max" :is_select="false" :filter="event => is_number( event )" />
	</div>
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
		},
		is_select: Boolean
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
				value = min
			if ( this.max != undefined && value > this.max )
				value = max
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

<style>
	.number-range-container
	{
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 100%;
	}

	.number-desc
	{
		padding-left: 1%;
		padding-right: 1%;
	}
</style>