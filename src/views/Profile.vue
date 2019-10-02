<template>
	<div class="profile">
		<app-spinner v-if="isLoading" />
		<app-error v-else-if="isError" :message="errorMessage" />
		<div v-else>
			<h1>Profile</h1>
			<div class="row">
				<div class="col s4"><p>Name</p></div>
				<div class="col s8"><p class="name teal-text text-darken-4">{{ userInfo.name }}</p></div>
			</div>
			<div class="divider"></div>
			<div class="row">
				<div class="col s4"><p>Username</p></div>
				<div class="col s8"><p class="username teal-text text-darken-4">{{ userInfo.username }}</p></div>
			</div>
			<div class="divider"></div>
			<div class="row">
				<div class="col s4"><p>Email</p></div>
				<div class="col s8"><p class="email teal-text text-darken-4">{{ userInfo.email }}</p></div>
			</div>
		</div>
	</div>
</template>

<script>
import AppSpinner from '@/components/AppSpinner.vue'
import AppError from '@/components/AppError.vue'
export default {
	components: { AppSpinner, AppError },

	data() {
		return {
			isLoading: false,
			isError: false,
			errorMessage: ''
		}
	},

	computed: {
		userInfo() {
			return this.$store.state.userInfo
		}
	},

	mounted() {
		if (!Object.entries(this.userInfo).length) {
			this.isLoading = true

			this.$store.dispatch('getUserInfo')
			.catch(err => {
				this.errorMessage = 'Error getting profile info: ' + err.message
				this.isError = true
			})
			.finally(() => {
				this.isLoading = false
			})
		}
		
	}
}
</script>