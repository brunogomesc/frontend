<template>
    <div class="modal-view-schedules" v-if="show">
        <div class="message-no-schedule">
            <p v-if="hasNoSchedule">Nenhuma agendamento realizado. Caso deseje realizar um agendamento clique no botão abaixo</p>
            <button class="primary-button" @click="onShowRegisterScheduleModal">Criar Agendamento</button>
            <ModalRegisterSchedule :show="showRegisterScheduleModal" @on-modal-close="onHideRegisterScheduleModal"/>
        </div>
        <div class="table-view-schedules" v-if="!hasNoSchedule">
            <h1 class="title-table">Próximos Agendamentos</h1>
            <table> <!-- ESTA É A TABELA QUE QUERO CENTRALIZAR VERTICALMENTE -->
                <tr> <!-- Informações -->
                    <td class="title-schedules">Data</td>
                    <td class="title-schedules">Legenda</td>
                    <td class="title-schedules">Rede Social</td>
                    <!-- <td class="title-schedules">Arquivos</td> -->
                </tr>
                <tr 
                    v-for="schedule in schedulesList"
                    :key="schedule.id"
                >
                    <td class="info-schedules">{{schedule.date_schedule}}</td>
                    <td class="info-schedules-modal" @click=saveViewLegend(schedule.legend)>{{schedule.legend}}</td>
                    <td class="info-schedules">{{schedule.nome_rede_social}}</td>
                    <!-- <td class="info-schedules-modal" @click=saveViewFiles(schedule.id) v-html="mediaIcon"></td> -->
                </tr>
            </table>
        </div>
        <Modal :show="showDetailsLegendScheduleModal" @on-modal-close="onCloseDetailsLegendScheduleModal">
            <h2>Legenda</h2>
            <p>{{this.saveLegend}}</p> 
        </Modal>
    </div>
</template>

<script>
import Mixin from '@/mixins/mixins'
import feather from 'feather-icons'
import axios from 'axios'
import ModalRegisterSchedule from '../components/ModalRegisterSchedule.vue'
import Modal from './Modal.vue'
export default {
    name: 'ModalCreateSchedule',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    components: {
        ModalRegisterSchedule,
        Modal
    },
    created() {
        this.onSearchNextSchedules();
    },
    mixins: [Mixin],
    data() {
        return {
            schedulesList: [],
            showRegisterScheduleModal: false,
            showDetailsLegendScheduleModal: false,
            showDetailsFileScheduleModal: false,
            saveLegend: '',
            noExibition: false,
            saveFileName: [],
        }
    },
    computed: {
       hasNoSchedule() {
            if(this.schedulesList.length == 0) {
                return true;
            }
            else {
                this.onViewCreateSchedule();
                return false;
            }
        },
        mediaIcon() {
            return feather.icons.clipboard.toSvg();
        },
    },
    methods: {
        onViewCreateSchedule() {
            this.noExibition = true;
        },
        onShowRegisterScheduleModal() {
            this.showRegisterScheduleModal = true;
        },
        onHideRegisterScheduleModal() {
            this.showRegisterScheduleModal = false;
        },
        onCloseRegisterScheduleModal() {
            this.showRegisterScheduleModal = false;
        },
        onCloseDetailsLegendScheduleModal() {
            this.showDetailsLegendScheduleModal = false;
        },
        onCloseDetailsFilesScheduleModal() {
            this.showDetailsFileScheduleModal = false;
        },
        onSearchNextSchedules() {
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
        saveViewLegend(legend) {
            this.saveLegend = legend;
            this.showDetailsLegendScheduleModal = true;
        },
        saveViewFiles(id) {
            this.saveFileName = id;
            console.log(this.saveFileName);
        }
    }
}
</script>

<style lang="less" scoped>
    .modal-view-schedules {
        position: fixed;
        top: 35%;
        left: 25%;

        .table-view-schedules {
            width: 800px;
            height: 450px;
            overflow-y: scroll;
            table {
                border: 1px solid @orange-black;
                
                
                tr {
                    border: 1px solid @orange-black;
                    td {
                        width: 250px;
                        height: 20px;
                        border-bottom: 1px solid @orange-black;
                    }
                }
            }

            .title-table{
                margin-left: 20%;
                color: @orange-black;
            }
            
            .title-schedules {
                padding-left: 5px;
                padding-bottom: 20px;
                color: @white;
                font-weight: 600;
                font-family:Georgia, 'Times New Roman', Times, serif;
                font-size: 24px;
                text-decoration: underline;
            }

            .info-schedules {
                padding-left: 5px;
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