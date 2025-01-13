<template>
	<button @click="toggle()">
		<font-awesome-icon v-if="getValue()" class="checkbox-check-mark" icon="fa-solid fa-check"></font-awesome-icon>
		<font-awesome-icon v-else class="checkbox-cross-mark" icon="fa-solid fa-xmark"></font-awesome-icon>
	</button>
</template>

<script>

export default {
	name: "Checkbox",
	props: {
		default_value: {
			type: Boolean,
			default: false
		},
		force_enabled: {
			type: Boolean,
			default: false
		},
		force_disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			val: this.default_value,
		}
	},
	methods: {
		toggle() {
			if (this.force_disabled) return;
			this.val = !this.val
			this.$emit( "change", this.getValue() )
		},
		getValue()
		{
			return ( this.val || this.force_enabled ) && !this.force_disabled
		},
		setValue( value ) {
			if (value == this.value) return;
			this.val = value
			this.$emit( "change", this.getValue() )
		}
	},
	emits: [ "change" ]
}

</script>