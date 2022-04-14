<template>
      <div class="homepage">
            <FunctionsMenu/>
            <NetworkBar/>
            <Modal :show="showAutenticateSucessModal" @on-modal-close="hideSuccessModal">
                  <div class="autenticate-modal">
                        <span v-html="successIcon" class="icon"></span>
                        <span>Usuario autenticado com sucesso.</span>
                  </div>
            </Modal>
            <ModalCreateSchedule :show="showCreateSchedulesModal"/>
            <ModalViewSchedule :show="showViewSchedulesModal"/>
            <ModalViewNetwork :show="showViewNetworkModal"/>
            <Options/>
      </div>
</template>

<script>
import Modal from '../components/Modal.vue'
import FunctionsMenu from '../components/FunctionsMenu.vue'
import NetworkBar from '../components/NetworkBar.vue'
import feather from 'feather-icons'
import Options from '../components/Options.vue'
import ModalCreateSchedule from '../components/ModalCreateSchedules.vue'
import ModalViewSchedule from '../components/ModalViewSchedules.vue'
import ModalViewNetwork from '../components/ModalViewNetwork.vue'
export default {
      data() {
            return {
                  showAutenticateSucessModal: true,
                  showCreateSchedulesModal: false,
                  showViewSchedulesModal: false,
                  showViewNetworkModal: false
            }
      },
      created() {
            if(Object.values(this.$store.state.userAutenticate).length == 0) {
                  window.history.back();
            }
      },
      components: {
            Modal,
            Options,
            FunctionsMenu,
            NetworkBar,
            ModalCreateSchedule,
            ModalViewSchedule,
            ModalViewNetwork
      },
      computed: {
            successIcon() {
                  return feather.icons['check-circle'].toSvg();
            },
            functionSelected() {
                  return this.$store.state.selectedFunction;
            }
      },
      methods: {
            hideSuccessModal() {
                  this.showAutenticateSucessModal = false;
                  this.showCreateSchedulesModal = true;
                  this.showViewSchedulesModal = false;
                  this.showViewNetworkModal = false;
            },
      },
      watch: {
            functionSelected() {
                  if(this.$store.state.selectedFunction == 'create') {
                        this.showAutenticateSucessModal = false;
                        this.showCreateSchedulesModal = true;
                        this.showViewSchedulesModal = false;
                        this.showViewNetworkModal = false;
                  }
                  else if(this.$store.state.selectedFunction == 'view') {
                        this.showAutenticateSucessModal = false;
                        this.showCreateSchedulesModal = false;
                        this.showViewSchedulesModal = true;
                        this.showViewNetworkModal = false;
                  }
                  else if(this.$store.state.selectedFunction == 'network') {
                        this.showAutenticateSucessModal = false;
                        this.showCreateSchedulesModal = false;
                        this.showViewSchedulesModal = false;
                        this.showViewNetworkModal = true;
                  }
            }
      }
}
</script>

<style lang="less" scoped>
      .homepage {
            display: flex;
            justify-content: space-between;

            .autenticate-modal {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  text-align: center;
                  padding-bottom: 20px;

                  .icon {
                        margin-bottom: 15px;
                  }
            }
      }
</style>