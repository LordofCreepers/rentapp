<template>
	<input v-if="!is_select" :class="$attrs.class" ref="date" type="date" @change="event => setValue( event.target.value )">
	<div v-else class="date-range-container">
		<h6 class="date-desc">Мин: </h6>
		<input :class="$attrs.class" ref="date_min" type="date" @change="event => setValue( event.target.value, 'min' )">
		<h6 class="date-desc">Макс: </h6>
		<input :class="$attrs.class" ref="date_max" type="date" @change="event => setValue( event.target.value, 'max' )">
	</div>
</template>

<script>

export default {
	name: "Date",
	props: {
		default_value: {
			type: [ String, Number, Date ],
			default: ""
		},
		min: [ String, Number, Date ],
		max: [ String, Number, Date ],
		is_select: Boolean
	},
	data() {
		return {
			value: 
				(this.is_select) ? 
					{ min: this.default_value, max: this.default_value } :
					this.default_value
		}
	},
	methods: {
		setValue( value, ref = null ) {
			let el = (ref == null) ? this.$refs.date : this.$refs['date_' + ref]
			if ( el == null ) return;
			if ( value == ((ref == null) ? this.value : this.value[ref]) ) return;
			let date = new Date( value ).valueOf()
			if ( this.min != undefined && date < this.min )
				date = min
			if ( this.max != undefined && date > this.max )
				date = max
			if (ref == null)
				this.value = date
			else
				this.value[ref] = data
			el.setAttribute( "valueAsNumber", date )
			this.$emit( "change", this.value )
		}
	},
	emits: [ "change" ]
}

</script>

<style>
	.date-range-container
	{
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 100%;
	}

	.date-desc
	{
		padding-left: 1%;
		padding-right: 1%;
	}
</style>