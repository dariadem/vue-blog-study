<template>
	<div class="posts-list-wrapper">
		<app-spinner v-if="isLoading" />
		<app-error v-else-if="isError" :message="errorMessage" />
		
		<div v-else class="posts-list-container">
			<h1>Blog</h1>
			<div class="posts-list-actions">
				<button type="button" class="btn btn-small blue-grey darken-1 "
					@click="sortPosts">Sort by {{ isSortedByNewest ? 'latest' : 'newest' }}</button>

				<button type="button" class="btn btn-small blue-grey darken-1"
					@click="filterPosts">Show {{ isFilteredByUser ? 'all' : 'my' }} posts</button>
			</div>

			<ul class="posts-list">
				<li class="posts-list-item"
					v-for="post in postsShown" :key="post.id">

					<div class="divider"></div>
					<router-link :to="{ path: `/posts/${post.id}` }" class="blue-grey-text">
						<p class="post-title">{{ post.title }}</p>
						<!-- {{ post.id }} -->
					</router-link>
				</li>
			</ul>

			<app-pagination :postsLength="posts.length"/>
		</div>
		
	</div>
</template>

<script>
import AppSpinner from '@/components/AppSpinner.vue'
import AppError from '@/components/AppError.vue'
import AppPagination from '@/components/AppPagination.vue'
export default {
	components: { 
		AppSpinner,
		AppError,
		AppPagination
	},

	data() {
		return {
			isLoading: false,
			isError: false,
			errorMessage: '',
			isSortedByNewest: true,
			isFilteredByUser: false,

			postsShown: []
		}
	},

	computed: {
		allPosts() {
			return this.$store.state.posts
		},
		filteredByUserPosts () {
			return this.$store.state.userPosts
		},
		posts() {
			return this.isFilteredByUser ? this.filteredByUserPosts : this.allPosts
		},
		
	},

	mounted() {
		if (!this.allPosts.length) {
			this.$store.dispatch('getAllPosts')
			.then(() => {
				this.isSortedByNewest = !!(this.posts[0].id > this.posts[1].id)
				this.setPostsShown()
			})
			.catch(err => {
				this.isError = true
				this.errorMessage = 'Error getting posts: ' + err.message
			})
			.finally(() => {
				this.isLoading = false
			})
		} else {
			this.setPostsShown()
		}
	},

	watch: {
		'$route' (to) {
			this.setPostsShown(to)
		}
	},

	methods: {
		setPostsShown(to) {
			const route = to ? to : this.$route
			const page = (route.query && route.query.page) ? route.query.page : 1
			const postsShown = [ ...this.posts ]
			const count = this.$store.state.postsPerPage
			this.postsShown = [ ...postsShown.splice((page - 1) * count, count) ]
		},

		sortPosts() {
			this.$store.dispatch('sortPosts', { isSortedByNewest: this.isSortedByNewest })
			this.isSortedByNewest = !this.isSortedByNewest
			this.setPostsShown(null)
		},

		filterPosts() {
			if (this.filteredByUserPosts.length) {
				this.setFilteredPosts()
			} else {
				this.$store.dispatch('getUserPosts')
					.then(() => {
						this.setFilteredPosts()
					})
					.catch(err => {
						this.isError = true
						this.errorMessage = `Error getting user's posts: ${err.message}`
					})
			}
		},

		setFilteredPosts() {
			this.isFilteredByUser = !this.isFilteredByUser
			if (this.$route.query && this.$route.query.page) {
				this.$router.push('/')
			}
			this.setPostsShown(null)
		}
	}
}
</script>

<style lang="scss" scoped>
.posts-list-actions {
	button {
		display: inline-block;
		margin: 1em 2em 0 0;
	}
}
.post-title {
	padding-left: 1em;
	text-transform: capitalize;
}
</style>