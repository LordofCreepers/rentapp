<template>
	<Textbox v-if="!is_select" ref="textbox" :is_select="false" :filter="is_number" @change="value => setValue( value )" />
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
	activated()
	{
		if (this.is_select)
		{
			this.$refs.textbox_min.setValue(this.default_value);
			this.$refs.textbox_max.setValue(this.default_value);
		}
		else
			this.$refs.textbox.setValue(this.default_value);
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
		getValue() {
			return (this.is_select) ?
				{
					min: Number(this.$refs.textbox_min.getValue()),
					max: Number(this.$refs.textbox_max.getValue())
				} :
				Number(this.$refs.textbox.getValue());
		},
		setValue( value, ref = null ) {
			let el = (ref == null) ? this.$refs.textbox : this.$refs['textbox_' + ref]
			if ( value == ((ref == null) ? this.getValue() : this.getValue()[ref]) ) return;
			if ( typeof Number( value ) != "number" )
			{
				this.setValue( 0, ref )
				return
			}
			if ( this.min != undefined && value < this.min )
				value = this.min
			if ( this.max != undefined && value > this.max )
				value = this.max
			el.setValue( value )
			this.$emit( "change", this.getValue() );
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