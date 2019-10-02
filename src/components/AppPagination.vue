<template>
	
	<ul class="pagination" v-if="pagesCount > 1">
		<li class="pag-control" :class="{ disabled: currentPage === 1 }">
			<router-link :to="{path: currentPath}" exact title="First page">
				<img svg-inline src="@/assets/img/icon-first-page.svg">
			</router-link>
		</li>

		<li class="pag-control" :class="{ disabled: currentPage === 1 }">
			<router-link :to="{path: currentPath, query: {page: currentPage - 1}}" exact title="Previous">
				<img svg-inline src="@/assets/img/icon-chevron-left.svg">
			</router-link>
		</li>


		<li v-for="page in pagesShown" :key="page"
			:class="{ active: (routerCurrentPage === page) || (!routerCurrentPage && (page === 1)) }">
			<router-link v-if="page === 1" :to="{path: currentPath}" exact>
				{{ page }}
			</router-link>
			<router-link v-else :to="{path: currentPath, query: {page: page}}" exact>
				{{ page }}
			</router-link>
		</li>


		<li class="pag-control" :class="{ disabled: currentPage === pagesCount }">
			<router-link :to="{path: currentPath, query: {page: currentPage + 1}}" exact title="Next">
				<img svg-inline src="@/assets/img/icon-chevron-right.svg">
			</router-link>
		</li>

		<li class="pag-control" :class="{ disabled: currentPage === pagesCount }">
			<router-link 
				:to="{path: currentPath, query: {page: pagesCount}}" 
				exact :title="'Page ' + pagesCount">
				<img svg-inline src="@/assets/img/icon-last-page.svg">
			</router-link>
		</li>
	</ul>
</template>

<script>
export default {
	props: ['postsLength'],
	data() {
		return {
			pagesShownCount: 5
		}
	},

	computed: {
		pagesCount() {
			return Math.ceil(this.postsLength / this.$store.state.postsPerPage)
		},
		currentPage() {
			const page = this.routerCurrentPage
			return page ? page : 1
		},
		routerCurrentPage() {
			return this.$route.query.page
		},
		currentPath() {
			return this.$route.path
		},
		pagesShown() {
			if (this.pagesShownCount >= this.pagesCount) return this.pagesCount

			const sideCount = (this.pagesShownCount % 2 === 0)
								? this.pagesShownCount / 2
								: (this.pagesShownCount - 1) / 2

			let pages = []
			for (let i = 1; i <= this.pagesShownCount; i++) {
				pages.push(i)
			}

			if (this.currentPage > sideCount + 1) {
				pages.forEach((pagenum, i, arr) => {
					arr[i] = this.currentPage - sideCount - 1 + +pagenum
				})
			}
			if (this.currentPage > this.pagesCount - sideCount) {
				pages.forEach((pagenum, i, arr) => {
					arr[i] = this.pagesCount - this.pagesShownCount + i + 1
				})
			}

			return pages
		}
	}

}
</script>

<style lang="scss" scoped>
.pagination {
	margin-top: 4rem;
	text-align: center;
}
.pag-control {
	display: inline-flex;

	a {
		display: flex;
		align-items: center;
	}
	&.disabled {
		opacity: .5
	}
	&:not(.disabled) {
		&:hover, &:focus {
			.base {
				fill: #009688
			}
		}
	}
}
.pagination li.active {
	background: #009688;
}
</style>