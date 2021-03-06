import api from '../../api'

// state
const state = {
    satuan_penjualans: [],
    satuan_penjualan: {
        id: '',
        index: '',
        satuan: ''
    },
    errors: {
        satuan: ''
    },
    pagination: {
        current_page: '',
        per_page: '',
        from: '',
        to: '',
        total: '',
        last_page: ''
    },
    selected: [],
    perPage: 5,
    loading: false
}

// mutations
const mutations = {
    fetch(state, payload) {
        state.satuan_penjualans = payload.data
        state.pagination = {
            current_page: payload.current_page,
            per_page: payload.per_page,
            from: payload.from,
            to: payload.to,
            total: payload.total,
            last_page: payload.last_page 
        }
    },
    update(state, payload) {
        state.satuan_penjualans.splice(payload.index, 1, payload.response)
    },
    setSelected(state, payload) {
        state.selected = payload
    },
    setPerPage(state, payload) {
        state.perPage = payload
    },
    setForm(state, payload) {
        state.satuan_penjualan = {
            id: payload.satuan_penjualan.id,
            index: payload.index,
            satuan: payload.satuan_penjualan.satuan
        }
    },
    emptyForm(state) {
        state.satuan_penjualan = {
            id: '',
            index: '',
            satuan: ''
        }
        state.errors = {
            satuan: ''
        }
    },
    setError(state, payload) {
        state.errors = payload
    },
    setErrorForm(state, payload) {
        state.errors.satuan = payload.satuan
    },
    setLoading(state, payload) {
        state.loading = payload
    }
}

// actions
const actions = {
    fetch({ commit }, perPage) {
        commit('setLoading', true)
        setTimeout(() => {
            axios.get(api.satuan_penjualan + 'index/' + perPage).then(response => {
                commit('fetch', response.data)
                commit('setPerPage', perPage)
                commit('setLoading', false)
            })
        }, 500)
    },
    fetchPerPage({ commit }, payload) {
        axios.get(api.satuan_penjualan + 'index/' + payload.perPage + '?page=' + payload.page).then(response => {
            commit('fetch', response.data)
            commit('setSelected', [])
        })
    },
    store({ commit }, payload) {
        axios.post(api.satuan_penjualan + 'store/' + payload.perPage, payload.satuan_penjualan).then(response => {
            commit('fetch', response.data)
            commit('setSelected', [])
            $("#addModal").modal('hide')
            flash('berhasil menambah data satuan penjualan', 'success')
        }).catch(error => {
            commit('setError', error.response.data.errors)
        })
    },
    update({ commit }, payload) {
        axios.patch(api.satuan_penjualan + 'update/' + payload.id, payload).then(response => {
            commit('update', {index: payload.index, response: response.data})
            commit('setSelected', [])
            $("#editModal").modal('hide')
            flash('data satuan penjualan berhasil diperbarui', 'success')
        }).catch(error => {
            commit('setError', error.response.data.errors)
        })
    },
    destroy({ commit }, payload) {
        axios.post(api.satuan_penjualan + 'destroy/' + payload.perPage, payload.selected).then(response => {
            commit('fetch', response.data)
            commit('setSelected', [])
            $("#deleteModal").modal('hide')
            var text = payload.selected.length > 1 ? payload.selected.length + ' satuan penjualan' : payload.selected[0].satuan
            flash(text + ' berhasil dihapus', 'success')
        }).catch(error => {
            $("#deleteModal").modal('hide')
            flash('gagal menghapus data', 'error')
        })
    },
    checkForm({ commit }, payload) {
        axios.post(api.satuan_penjualan + 'checkForm', payload).then(response => {
            var error = ''
            commit('setErrorForm', error)
        }).catch(error => {
            var error = error.response.data.errors
            commit('setErrorForm', error)
        })
    }
}

// getters
const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}