<template>
	<input :class="$attrs.class" v-if="!is_select" ref="date" type="date" @change="event => changed( event )">
	<div class="date-range-container" v-else>
		<h6 class="date-desc">Мин: </h6>
		<input :class="$attrs.class" ref="date_min" type="date">
		<h6 class="date-desc">Мин: </h6>
		<input :class="$attrs.class" ref="date_max" type="date">
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
		is_select: Boolean,
		min: [ String, Number, Date ],
		max: [ String, Number, Date ]
	},
	data() {
		return {
			value: this.default_value
		}
	},
	methods: {
		changed( event ) {
			this.setValue( event.target.valueAsNumber )
		},
		setValue( value ) {
			if ( this.$refs.date == null ) return;
			if (!is_select)
			{
				if ( value == this.value ) return;
				let date = new Date( value ).valueOf()
				if ( this.min != undefined && date < this.min )
				{
					date = min
					this.value = date
				}
				if ( this.max != undefined && date > this.max )
				{
					date = max
					this.value = date
				}
				this.$refs.date.setAttribute( "valueAsNumber", date )
			}
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