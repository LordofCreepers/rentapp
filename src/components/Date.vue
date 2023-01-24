<template>
	<input ref="date" type="date" @change="event => changed( event )">
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
		max: [ String, Number, Date ]
	},
	data() {
		return {
			value: this.default_value
		}
	},
	created() {
		if ( this.default_value == undefined ) return;
		let date = new Date( this.default_value )
		if ( this.min != undefined )
			this.$refs.date.setAttribute( "min", min )
		if ( this.max != undefined && new Date( this.max ) < data )
			this.$refs.date.setAttribute( "max", max )
		this.setValue( date )
	},
	methods: {
		changed( event ) {
			let value = event.target.valueAsNumber
			if ( this.min != undefined && new Date( min ) > value )
				value = min
			if ( this.max != undefined && new Date( max ) < value )
				value = max
			this.setValue( value )
			this.$emit( "change", value )
		},
		setValue( value ) {
			if ( this.$refs.date == null ) return;
			if ( value == this.value ) return;
			let date = new Date( value ).valueOf()
			if ( this.min != undefined && date < this.min )
			this.value = date
			this.$refs.date.setAttribute( "valueAsNumber", date )
		}
	}
}

</script>