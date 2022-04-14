<template>
    <div class="modal-view-schedules" v-if="show">
        <div class="table-view-schedules">
            <h1 class="title-table">Visualizar Agendamentos</h1>
            <div class="radio-container">
                <div class="radio-options">
                    <input type="radio" name="schedules-all" id="all" value="all" v-model="schedulesType" @change="onAllSchedule">
                    <label for="all">Todos Agendamentos</label>
                </div>
                <div class="radio-options">
                    <input type="radio" name="schedules-concluded" id="concluded" value="concluded" v-model="schedulesType" @change="onCompletedSchedule">
                    <label for="concluded">Agendamentos Concluidos</label>
                </div>
                <div class="radio-options">
                    <input type="radio" name="schedules-coming" id="coming" value="coming" v-model="schedulesType" @change="onNextSchedule">
                    <label for="coming">Próximos Agendamentos</label>
                </div>
            </div>
            <div class="table-schedules">
                <table> <!-- ESTA É A TABELA QUE QUERO CENTRALIZAR VERTICALMENTE -->
                    <tr> <!-- Informações -->
                        <td class="title-schedules">Data</td>
                        <td class="title-schedules">Legenda</td>
                        <td class="title-schedules">Rede Social</td>
                        <!-- <td class="title-schedules">Arquivos</td> -->
                        <td class="title-schedules">Editar/Remover</td>
                    </tr>
                    <tr 
                        v-for="schedule in schedulesList"
                        :key="schedule.id"
                    >
                        <td class="info-schedules">{{schedule.date_schedule}}</td>
                        <td class="info-schedules-modal" @click=saveViewLegend(schedule.legend)>{{schedule.legend}}</td>
                        <td class="info-schedules">{{schedule.nome_rede_social}}</td>
                        <td class="info-schedules-row">
                            <button @click="onShowUpdateModal(schedule)" v-html="editIcon" class="info-schedules-modal-button"></button>
                            <button @click="onShowDeleteModal(schedule)" v-html="trashIcon" class="info-schedules-modal-button"></button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <Modal :show="showDetailsLegendScheduleModal" @on-modal-close="onCloseDetailsLegendScheduleModal">
            <h2>Legenda</h2>
            <p>{{this.saveLegend}}</p> 
        </Modal>
        <Modal :show="showDeleteModal" @on-modal-close="hideDeleteModal">
            <div class="modal-content">
                <h2>Exclusão</h2>
                <div class="account-container">
                    <h4>Deseja realmente excluir este agendamento?</h4>
                </div>
                <div class="button-container">
                    <button class="secondary-button" @click="hideDeleteModal">Cancelar</button>
                    <button class="primary-button" @click="onDeleteDatabase">Excluir</button>
                </div>
            </div>
        </Modal>
        <ModalUpdate :show="showUpdateModal" :updateSchedule="scheduleUpdate" @on-modal-close="hideUpdateModal"/>
    </div>
</template>

<script>
import Mixin from '@/mixins/mixins'
import feather from 'feather-icons'
import axios from 'axios'
import Modal from './Modal.vue'
import ModalUpdate from './ModalUpdateSchedules.vue'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Modal,
        ModalUpdate
    },
    mixins: [Mixin],
    data() {
        return {
            schedulesList: [],
            scheduleUpdate: [],
            schedulesType: 'all',
            showDeleteModal: false,
            showUpdateModal: false,
            actualIdQueue: 0,
            showDetailsLegendScheduleModal: false,
            saveLegend: '',
        }
    },
    created() {
        this.onAllSchedule();
    },
    computed: {
       hasNoSchedule() {
            if(this.schedulesList.length == 0) {
                return true;
            }
            else {
                return false;
            }
        },
        editIcon() {
            return feather.icons.edit.toSvg();
        },
        trashIcon() {
            return feather.icons.trash.toSvg();
        }
    },
    methods: {
        onCloseDetailsLegendScheduleModal() {
            this.showDetailsLegendScheduleModal = false;
        },
        onShowUpdateModal(schedule) {
            this.scheduleUpdate = schedule;
            this.showUpdateModal = true;
        },
        saveViewLegend(legend) {
            this.saveLegend = legend;
            this.showDetailsLegendScheduleModal = true;
        },
        onAllSchedule() {
            this.showUpdateModal = false;
            return new Promise (()=>{
                axios.get(`${this.urlAPI()}/search_all_schedules`, { params:{
                    'id_login': this.$store.state.userAutenticate[0]['id_login'],
                    'network_active': this.$store.state.selectedNetwork,
                }}).then( response => {
                    this.schedulesList = response.data
                    return;
                })
            })
        },
        onNextSchedule() {
            this.showUpdateModal = false;
            return new Promise (()=>{
                axios.get(`${this.urlAPI()}/search_next_schedules`, { params:{
                    'id_login': this.$store.state.userAutenticate[0]['id_login'],
                    'network_active': this.$store.state.selectedNetwork,
                }}).then( response => {
                    this.schedulesList = response.data
                    return;
                })
            })
        },
        onCompletedSchedule() {
            this.showUpdateModal = false;
            return new Promise (()=>{
                axios.get(`${this.urlAPI()}/search_completed_schedules`, { params:{
                    'id_login': this.$store.state.userAutenticate[0]['id_login'],
                    'network_active': this.$store.state.selectedNetwork,
                }}).then( response => {
                    this.schedulesList = response.data
                    return;
                })
            })
        },
        hideDeleteModal() {
            this.showDeleteModal = false;
        },
        hideUpdateModal() {
            this.showUpdateModal = false;
        },
        onShowDeleteModal(queue) {
            this.actualIdQueue = queue['id_queue'];
            this.showDeleteModal = true;
        },
        onDeleteDatabase() {
            return new Promise (()=>{
                axios.delete(`${this.urlAPI()}/delete_schedule/${this.actualIdQueue}`).then( () => {this.hideDeleteModal()})
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .modal-view-schedules {
        position: absolute;
        top: 30%;
        left: 25%;

        .modal-content {
            width: 800px;
            height: 200px;

            button {
                width: 250px;
            }
        }

        .table-view-schedules {
            align-items: center;
            justify-content: center;
            .table-schedules {
                height: 350px;
                width: 800px;
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

            .radio-container {
                display: flex;
                width: 400px;
                
                .radio-options {
                    margin-left: 0;
                    padding-left: 0;
                    width: 280px;
                    height: 100px;

                    label {
                        padding: 0 0px 0 50px;
                    }
                }
            }

        }
    }

</style>