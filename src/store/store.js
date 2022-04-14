import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
      state: {
            userAutenticate: [],
            networkList: [],
            selectedFunction: '',
            selectedNetwork: ''
      },
      mutations: {
            saveUserAutenticate(state, user){
                  state.userAutenticate.push({
                        user: user.user_login, 
                        pass: user.password_login, 
                        id_login: user.id_login
                  })
            },
            saveNetworksRegisters(state, network){
                  state.networkList.push({
                        id_login: network.id_login, 
                        user: network.login_user, 
                        icon: network.icon, 
                        id: network.icon
                  })
            },
            changeFunction (state, id) {
                  state.selectedFunction = id;
            },
            changeNetwork (state, id) {
                  state.selectedNetwork = id;
            },
      },
      actions: {
            saveUserAutenticate({commit}, user) {
                  commit('saveUserAutenticate', user)
            },
            saveNetworksRegisters({commit}, network) {
                  commit('saveNetworksRegisters', network)
            },
            changeFunction (context, id) {
                  context.commit('changeFunction', id);
            },
            changeNetwork (context, id) {
                  context.commit('changeNetwork', id);
            },
      }
})