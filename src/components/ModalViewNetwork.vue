<template>
      <div class="modal-content" v-if="show">
            <div class="message-no-schedule">
                  <button class="primary-button" @click="onShowRegisterNetwork">Cadastrar Rede Social</button>
                  <ModalRegisterNetwork :show="showRegisterScheduleModal" @on-modal-close="onHideRegisterNetworkModal"/>
            </div>
            <div class="table-view-schedules" v-if="!hasNoSchedule">
                  <h1 class="title-table">Listagem de Rede Sociais</h1>
                  <table class="table-schedules"> <!-- ESTA É A TABELA QUE QUERO CENTRALIZAR VERTICALMENTE -->
                        <tr> <!-- Informações -->
                              <td class="title-schedules">Usuário</td>
                              <td class="title-schedules">Rede Social</td>
                              <td class="title-schedules">Editar/Remover</td>
                        </tr>
                        <tr 
                              v-for="network in networkList"
                              :key="network.id"
                        >
                              <td class="info-schedules">{{network.user}}</td>
                              <td class="info-schedules">{{network.id}}</td>
                              <td class="info-schedules-row">
                                    <button @click="onShowUpdateNetworkModal(network)" v-html="editIcon" class="info-schedules-modal-button"></button>
                                    <button @click="onShowDeleteNetworkModal(network)" v-html="trashIcon" class="info-schedules-modal-button"></button>
                              </td>
                        </tr>
                  </table>
            </div>
            <Modal :show="showDeleteModal" @on-modal-close="hideDeleteModal">
                  <div class="modal-container">
                        <h2>Exclusão</h2>
                        <div class="account-container">
                              <h4>Deseja realmente excluir esta rede social?</h4>
                        </div>
                        <div class="button-container">
                              <button class="secondary-button" @click="hideDeleteModal">Cancelar</button>
                              <button class="primary-button" @click="onDeleteDatabase">Excluir</button>
                        </div>
                  </div>
            </Modal>
            <Modal :show="showUpdateModal" @on-modal-close="hideUpdateModal">
                  <div class="modal-container">
                        <div class="modal--close" v-html="closeIcon" @click="hideUpdateModal"></div>
                        <div class="modal-container-view">
                              <h1>Adicionar Rede Social</h1>
                              <div class="network-container">
                                    <div class="input-field">
                                          <label for="">{{formNetworkData.user.label}}</label>
                                          <input type="text" :placeholder="formNetworkData.user.placeholder" v-model="formNetworkData.user.value" @blur="formNetworkData.user.isValid()" :class="{'error' : !formNetworkData.user.valid}">
                                          <p class="error-message" v-if="!formNetworkData.user.valid">{{formNetworkData.user.errorMessage}}</p>
                                    </div>
                                    <div class="input-field">
                                          <label for="">{{formNetworkData.pass.label}}</label>
                                          <input type="password" :placeholder="formNetworkData.pass.placeholder" v-model="formNetworkData.pass.value" @blur="formNetworkData.pass.isValid()" :class="{'error' : !formNetworkData.pass.valid}">
                                          <p class="error-message" v-if="!formNetworkData.pass.valid">{{formNetworkData.pass.errorMessage}}</p>
                                    </div>
                              </div>
                        </div>
                        <button class="secondary-button" @click="hideUpdateModal">Cancelar</button>
                        <button class="primary-button" @click="updateNetworkDatabase">Atualizar</button>
                        <!-- <div class="loading-container">
                              <Loading v-if="isLoading"/>
                        </div>
                        <div class="alert-container--valid" v-if="userAutenticateNetwork">
                              <h1 class="alert-container--info">Usuário validado e dados cadastrados com sucesso</h1>
                        </div>
                        <div class="alert-container--not-valid" v-else-if="userNotAutenticateNetwork">
                              <h1 class="alert-container--info">Usuário não validado, por favor verificados se os dados de acesso e o tipo de rede social estão corretos</h1>
                        </div> -->
                  </div>
            </Modal>
      </div>
</template>

<script>
import ModalRegisterNetwork from './ModalRegisterNetwork.vue'
import Modal from './Modal.vue'
import feather from 'feather-icons'
import axios from 'axios'
export default {
      props: {
            show: {
                  type: Boolean,
                  default: false
            }
      },
      data() {
            return {
                  networkList: this.$store.state.networkList,
                  showRegisterScheduleModal: false,
                  showDeleteModal: false,
                  showUpdateModal: false,
                  userActual: '',
                  network: '',
                  formNetworkData: {
                        user: {
                              value: '',
                              placeholder: 'Digite seu usuário',
                              errorMessage: 'O usuário é obrigatório',
                              label: 'Uuário *',
                              valid: true,
                              isValid: () => {
                                    this.formNetworkData.user.valid = !!this.formNetworkData.user.value.length;
                              }
                        },
                        pass: {
                              value: '',
                              placeholder: 'Digite sua senha',
                              errorMessage: 'A senha é obrigatória',
                              label: 'Senha *',
                              valid: true,
                              isValid: () => {
                                    this.formNetworkData.pass.valid = !!this.formNetworkData.pass.value.length;
                              }
                        }
                  }
            }
      },
      components: {
            ModalRegisterNetwork,
            Modal
      },
      computed: {
            editIcon() {
                  return feather.icons.edit.toSvg();
            },
            trashIcon() {
                  return feather.icons.trash.toSvg();
            }
      },
      methods: {
            onShowRegisterNetwork() {
                  this.showRegisterScheduleModal = true;
            },
            onHideRegisterNetworkModal() {
                  this.showRegisterScheduleModal = false;
            },
            onShowUpdateNetworkModal(network) {
                  console.log(network)
                  this.formNetworkData.user.value = network['user']
                  this.showUpdateModal = true;
            },
            onShowDeleteNetworkModal(network) {
                  this.userActual = network['user'];
                  this.network = this.$store.state.selectedNetwork;
                  this.showDeleteModal = true;   
            },
            hideDeleteModal() {
                  this.showDeleteModal = false;
            },
            hideUpdateModal() {
                  this.showUpdateModal = false;
            },
            onDeleteDatabase() {
                  return new Promise (()=>{
                        axios.delete(`${this.urlAPI()}/delete_network/${this.userActual}/${this.network}`).then( () => {this.hideDeleteModal()})
                  })
            },
            onUpdateNetworkDatabase() {
                  return new Promise (()=>{
                        axios.put(`${this.urlAPI()}/update_network`,{user: this.formNetworkData.user.value, pass: this.formNetworkData.pass.value, network: this.$store.state.selectedNetwork}).then( () => {
                              this.hideUpdateModal();
                        })
                  })
            }
      }
}
</script>

<style lang="less" scoped>
      .modal-content {
            position: absolute;
            top: 30%;
            left: 25%;

            .modal-container {
                  width: 700px;
                  height: 250px;

                  button {
                        width: 250px;
                  }
            }

            .table-view-schedules {
            align-items: center;
            justify-content: center;
            .table-schedules {
                height: 100px;
                width: 600px;
                overflow: auto;

                .info-schedules-row {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    .info-schedules-modal-button {
                        width: 100px;
                        height: 40px;
                        background: @orange-black;
                        border: 1px solid @orange-black;
                        cursor: pointer;
                        border-radius: 8px;
                        color: @white;
                    }
                }
            }

            table {
                border: 1px solid @orange-black;
                tr {
                    border: 1px solid @orange-black;
                    td {
                        border-bottom: 1px solid @orange-black;
                        width: 180px;
                    }
                }
            }

            .title-table{
                margin-left: 20%;
                color: @orange-black;
            }
            
            .title-schedules {
                padding-left: 10px;
                padding-bottom: 20px;
                color: @white;
                font-weight: 600;
                font-family:Georgia, 'Times New Roman', Times, serif;
                font-size: 24px;
                text-decoration: underline;
            }

            .info-schedules {
                padding-left: 10px;
                color: @orange-light;
            }

            .info-schedules-modal {
                padding-left: 10px;
                color: @orange-light;
                cursor: pointer;
                height: fit-content;
            }

            .message-no-schedule {
                margin-left: 50px;
            }

        }
      }
</style>