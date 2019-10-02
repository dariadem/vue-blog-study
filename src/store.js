import Vue from 'vue'
import Vuex from 'vuex'
import { http } from './assets/utils/axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		isUserAuthenticated: true,
		userId: 4,
		userInfo: {},
		posts: [],
		userPosts: [],
		currentPost: {},
		currentPostAuthor: '',
		currentPostComments: [],

		postsPerPage: 12
	},


	mutations: {
		setUserInfo(state, data) {
			state.userInfo = { ...data }
		},
		
		setPosts(state, data) {
			state.posts = [...data]
		},

		setUserPosts(state, data) {
			state.userPosts = [...data]
		},

		setCurrentPost(state, { data, author }) {
			state.currentPost = { ...data }
			state.currentPostAuthor = author
		},

		setPostComments(state, data) {
			// post comment sorted from newest to latest
			state.currentPostComments = [ ...data.sort((a, b) => b.id - a.id) ]
		},

		sortPosts(state, isSortedByNewest) {
			const compare = isSortedByNewest ? 
				(a, b) => (a.id - b.id)
				: (a, b) => (b.id - a.id)

			state.posts = [...state.posts.sort(compare)]
			state.userPosts = [...state.userPosts.sort(compare) ]
		},

		addCommentToStore(state, comment) {
			state.currentPostComments = [ comment, ...state.currentPostComments ]
		},

		editPostInStore(state, { postData, postId }) {
			if (state.posts.length) {
				const index = state.posts.findIndex((post => post.id === postId))
				if (index !== -1) {
					Vue.set(state.posts, index, postData)
				}
				const index2 = state.userPosts.findIndex((post => post.id === postId))
				if (index2 !== -1) {
					Vue.set(state.userPosts, index2, postData)
				}
			}
			state.currentPost = { ...postData }
		},

		deletePostFromStore(state, postId) {
			if (state.posts.length) {
				const posts = state.posts.filter(post => post.id !== postId)
				state.posts = [...posts]
			}
			if (state.userPosts.length) {
				const userPosts = state.userPosts.filter(post => post.id !== postId)
				state.userPosts = [...userPosts]
			}
		}
	},

	
	actions: {
		async getUserInfo({ commit, state }) {
			const res = await http.get(`users/${state.userId}`)
			commit('setUserInfo', res.data)
		},

		async getAllPosts({ commit }) {
			const res = await http.get(`posts`)
			commit('setPosts', res.data)
		},

		async getUserPosts({ commit, state }) {
			const res = await http.get(`posts?userId=${state.userId}`)

			// server returns an empty array for non-existing userId
			if (!res.data.length) throw new Error('no posts found')

			commit('setUserPosts', res.data)
		},

		async getPost({ commit }, id) {
			const res = await http.get(`posts/${id}`)
			const author = await http.get(`users/${res.data.userId}`)
			commit('setCurrentPost', { data: res.data, author: author.data.name} )
		},

		async getPostComments({ commit }, id) {
			const res = await http.get(`comments?postId=${id}`)
			commit('setPostComments', res.data)
		},

		sortPosts({ commit }, { isSortedByNewest }) {
			commit('sortPosts', isSortedByNewest)
		},

		async postComment({ commit }, commentData) {
			const res = await http.post(`comments`, commentData)
			commit('addCommentToStore', res.data)
		},

		async editPost({ commit }, { postData, postId }) {
			const res = await http.patch(`posts/${postId}`, postData)
			commit('editPostInStore', { postData: res.data, postId })
		},

		async deletePost({ commit }, postId) {
			await http.delete(`posts/${postId}`)
			commit('deletePostFromStore', postId)
		}
	}
})
