<template>
	<div class="root">
		<div class="navbar-fixed">
			<nav v-if="isUserAuthenticated" class="teal">
				<div class="nav-wrapper container">
					<ul>
						<li><router-link to="/">Blog</router-link></li>
						<li><router-link to="/profile">Profile</router-link></li>
					</ul>
				</div>
			</nav>
		</div>

		<div class="container main-content">
			<router-view/>
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		isUserAuthenticated() {
			return this.$store.state.isUserAuthenticated
		}
	}
}
</script>

<style scoped>
.main-content {
	padding-bottom: 100px;
}
</style>