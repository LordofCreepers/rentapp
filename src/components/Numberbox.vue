<template>
	<Textbox v-if="!is_select" ref="textbox" :is_select="false" :filter="is_number" @change="event => setValue( event.target.value )" />
	<div class="number-range-container" v-else>
		<h6 class="number-desc">Мин: </h6>
		<Textbox :class="$attrs.class" ref="textbox_min" :is_select="false" :filter="is_number" @change="value => setValue( value, 'min' )" />
		<h6 class="number-desc">Макс: </h6>
		<Textbox :class="$attrs.class" ref="textbox_max" :is_select="false" :filter="is_number" @change="value => setValue( value, 'max' )" />
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
		min: {
			type: Number,
			default: undefined
		},
		max: {
			type: Number,
			default: undefined
		},
		filter: {
			type: Function,
			default: () => true
		},
		is_select: Boolean
	},
	data()
	{
		return {
			value: (this.is_select) ? 
				{ min: this.default_value, max: this.default_value } :
				this.default_value
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
		setValue( value, ref = null ) {
			let el = (ref == null) ? this.$refs.textbox : this.$refs['textbox_' + ref]
			if ( value == ((ref == null) ? this.value : this.value[ref]) ) return;
			if ( typeof Number( value ) != "number" )
			{
				this.setValue( 0, ref )
				return
			}
			if ( this.min != undefined && value < this.min )
				value = this.min
			if ( this.max != undefined && value > this.max )
				value = this.max
			if (ref == null)
				this.value = value
			else
			{
				if (typeof this.value == "number")
					this.value = { min: this.default_value, max: this.default_value }
				this.value[ref] = value
			}
			el.setValue( value )
			this.$emit( "change", value )
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