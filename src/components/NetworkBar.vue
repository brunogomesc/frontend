<template>
      <div class="network-bar">
            <ul>
                  <li
                        v-for="network in networkList"
                        :key="network.id"
                        @click="onNetworkClick(network.id)"
                        :class="{ 'active': isActiveNetwork(network.id) }"
                  >
                        <component :is="network.id" />
                  </li>
            </ul>
            <div class="network-bar--no-info" v-if="hasNoNetwork">
                  <p>Nenhuma Rede Social cadastrada. Caso deseje cadastrar clique no botão abaixo</p>
                  <button class="primary-button" @click="onShowNetworkModal">Cadastrar Rede Social</button>
            </div>
            <ModalRegisterNetwork :show="showNetworkModal" @on-modal-close="hideNetworkModal"/>
      </div>
</template>

<script>
import Instagram from '../assets/icons/instagram.svg'
import facebook from '../assets/icons/facebook.svg'
import twitter from '../assets/icons/twitter.svg'
import Modal from './Modal.vue'
import ModalRegisterNetwork from './ModalRegisterNetwork.vue'
export default {
      data() {
            return {
                  selectedNetwork: '',
                  showNetworkModal: false,
                  networkList: []
            }
      },
      computed: {
            hasNoNetwork() {
                  if(this.$store.state.networkList.length == 0) {
                        return true;
                  }
                  else {
                        this.refreshNetworkSaved();
                        return false;
                  }
            }
      },
      watch: {
            networksSaved() {
                  this.refreshNetworkSaved();
            }
      },
      components: {
            Instagram,
            facebook,
            twitter,
            Modal,
            ModalRegisterNetwork
      },
      mounted() {
            this.onNetworkClick('instagram');
      },
      methods: {
            refreshNetworkSaved(){
                  this.networkList = this.$store.state.networkList;
            },
            isActiveNetwork(id) {
                  return this.selectedNetwork === id;
            },
            onNetworkClick(id) {
                  this.selectedNetwork = id;
                  this.$store.dispatch('changeNetwork', id); 
            },
            onShowNetworkModal() {
                  this.showNetworkModal = true;
            },
            hideNetworkModal() {
                  this.showNetworkModal = false;
            }
      }
}
</script>

<style lang="less" scoped>
      .network-bar {
           
            .network-bar--no-info {
                  display: flex;
                  flex-direction: column;

                  p {
                        color: @white;
                  }
            }

            ul {
                  list-style: none;
                  padding: 0px;
                  width: 100%;
                  display: table;

                  li {
                        display: table-cell;
                        text-align: center;
                        vertical-align:middle;
                        height: 50px;
                        padding: 15px;

                        svg {
                              path {
                                    fill: none;
                              }

                              cursor: pointer;
                        }

                        &.active {
                              background: @orange-black;
                              border-radius: 8px;
                              width: 100%;
                              height: 100%;
                              border: 1px solid @orange-light;

                              svg {
                                    path {
                                          fill: none;
                                    }

                                    cursor: pointer;
                              }
                        }
                  }
            }

            &--no-info {
                  display: block;
                  flex-direction: row;
                  align-items: center;

                  button {
                        margin: 2px auto;
                  }
            }
      }
</style>