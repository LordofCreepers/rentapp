<template>
	<button @click="toggle()">
		<font-awesome-icon v-if="value" class="checkbox-check-mark" icon="fa-solid fa-check"></font-awesome-icon>
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
	computed: {
		value() {
			return ( this.val || this.force_enabled ) && !this.force_disabled
		}
	},
	methods: {
		toggle() {
			this.val = !this.val
			this.$emit( "change", this.value )
		},
		setValue( value ) {
			this.val = value
			this.$emit( "change", this.value )
		}
	},
	emits: [ "change" ]
}

</script>