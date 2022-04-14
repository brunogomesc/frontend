<template>
    <div class="modal" v-if="show">
        <div class="modal--content">
            <div class="modal--close" v-html="closeIcon" @click="onCloseButtonClick"></div>
            <div class="modal-container">
                <h1>Criar Agendamento em: {{this.$store.state.selectedNetwork}}</h1>
                <h5>Caso seja adicionado mais de um arquivo, será publicado no formato carrossel. Por favor utilizar somente os formatos .PNG e .JPG para fotos e .MP4 para videos</h5>
                <form :action="urlFile" method="POST" enctype="multipart/form-data">
                    <div class="input-container">
                        <div class="input-options-send-files">
                            <input 
                                type="file" 
                                class="filesSchedules" 
                                id="filesSchedules"
                                name="filesSchedules"
                                accept="image/png, image/jpeg, video/mp4" 
                                multiple 
                                @change="handleFiles($event)"
                                ref="filesSchedules" 
                                style="display: none;"
                            >
                            <div class="view-schedules-files">
                                <ul>
                                    <li
                                        v-for="files in formScheduleData.schedule.files"
                                        :key="files.name"
                                    >
                                        <p>{{ files.name }}</p>
                                    </li>
                                </ul>
                            </div>
                            <label class="primary-button" @click="uploadFiles">Enviar arquivos</label>
                        </div>
                        <div class="modal-network-publication-type">
                            <input type="text" name="input-options-type-schedule" class="input-options-type-schedule" :value="this.schedulesType">
                            <input type="text" name="input-options-network-active" class="input-options-network-active" :value="this.$store.state.selectedNetwork">
                            <input type="text" name="input-options-user-autenticate" class="input-options-user-autenticate" :value="this.$store.state.userAutenticate[0]['id_login']">
                        </div>
                    </div>
                    <h3 class="modal-title-legend">Legenda</h3>
                    <div class="input-options-textarea-legend">
                         <textarea 
                            class="input-options-legend" 
                            id="input-options-legend" 
                            name="input-options-legend"
                            rows="100"
                            cols="1000"
                            maxlength="5000"
                            minlength="1"
                            @change="handleLegend($event)" 
                        />
                    </div>
                    <div class="input-options-date-time">
                        <p class="input-options-date-label">Data:</p>
                        <input class="input-options-date" name="input-options-date" type="date" id="input-options-date" :min="getMinDate" @change="handleDate($event)"/>
                        <p class="input-options-time-label">Horário:</p>
                        <input class="input-options-time" name="input-options-time" type="time" id="input-options-time" @change="handleTime($event)"/>
                    </div>
                    <button class="secondary-button"  @click="onCloseButtonClick">Cancelar</button>
                    <button class="primary-button-submit" type="submit">Adicionar</button>
                </form>
            </div>
            <div class="loading-container">
                <Loading v-if="isLoading"/>
            </div>
            <div class="alert-container--valid" v-if="false">
                <h1 class="alert-container--info">Usuário validado e dados cadastrados com sucesso</h1>
            </div>
            <div class="alert-container--not-valid" v-else-if="isLoading">
                <h1 class="alert-container--info">Usuário não validado, por favor verificados se os dados de acesso e o tipo de rede social estão corretos</h1>
            </div>
        </div>
    </div>
</template>

<script>
import feather from 'feather-icons'
import Mixin from '@/mixins/mixins'
import Loading from './Loading.vue'
import axios from 'axios'
import moment from 'moment'
export default {
    name: 'Modal',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Loading
    },
    mixins: [Mixin],
    data() {
        return {
            isShow: false,
            isLoading: false,
            schedulesType: '',
            isVisibleScheduleFiles: false,
            formScheduleData: {
                schedule: {
                    files: [],
                    legend: '',
                    type: '',
                    network: '',
                    date: '',
                    time: ''
                }
            }
        }
    },
    computed: {
        closeIcon() {
            return feather.icons.x.toSvg();
        },
        urlFile() {
            return `${this.urlAPI()}/save_schedule`
        },
        getMinDate() {
            return moment(new Date()).format('YYYY-MM-DD');
        }
    },
    methods: {
        onCloseButtonClick() {
            this.$emit('on-modal-close')
            //this.$props.show = false;
        },
        clearFormRegisterNetwork() {
            //ZERANDO FORMULÁRIO DE USER
            this.formNetworkData.user.value = '';
            this.formNetworkData.user.placeholder = 'Digite seu usuário';
            this.formNetworkData.user.errorMessage = 'O usuário é obrigatório';
            this.formNetworkData.user.label = 'Uuário *';
            this.formNetworkData.user.valid = true;

            //ZERANDO FORMULÁRIO DE PASS
            this.formNetworkData.pass.value = '';
            this.formNetworkData.pass.placeholder = 'Digite sua senha';
            this.formNetworkData.pass.errorMessage = 'A senha é obrigatória';
            this.formNetworkData.pass.label = 'Senha *';
            this.formNetworkData.pass.valid = true;

            //ZERANDO RADIO OPTIONS DAS REDES SOCIAIS
            this.networkType = 'instagram';
        },
        async onValidateSchedule(){
            this.saveInfos();
            await axios.post(`${this.urlAPI()}/uploader`, {schedule: this.formScheduleData.schedule})
            .then((response) => {
                if(response.status == 200) {
                    alert(response.data);
                }   
            });
        },
        saveInfos() {
            this.formScheduleData.schedule.network = this.$store.state.selectedNetwork;
            if(this.formScheduleData.schedule.files.length == 1) {
                this.formScheduleData.schedule.type = 'unique';
            }
            else {
                this.formScheduleData.schedule.type = 'carousel';
            }
        },
        uploadFiles() {
            this.$refs.filesSchedules.value = null;
            this.$refs.filesSchedules.click();
        },
        handleFiles(event) {
            this.formScheduleData.schedule.files = event.target.files;
            console.log(this.formScheduleData.schedule.files.length)
            if(this.formScheduleData.schedule.files.length == 1) {
                this.schedulesType = 'unique'
            }
            else if(this.formScheduleData.schedule.files.length != 1) {
                this.schedulesType = 'carousel'
            }
        },
        handleDate(event) {
            this.formScheduleData.schedule.date = event.target.value;
        },
        handleTime(event) {
            this.formScheduleData.schedule.time = event.target.value;
        },
        handleLegend(event) {
            this.formScheduleData.schedule.legend = event.target.value;
        },
        handleClickSubmit(event) {
            event.preventDefault();
            this.onValidateSchedule();
        }
    }
}

</script>

<style lang="less" scoped>
    .modal {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
        overflow: auto;

        .modal--content {
            background: white;
            border-radius: 8px;
            width: 600px;
            padding: 30px;
            position: absolute;
            top: 50%;
            right: 50%;
            transform: translate(50%, -50%);
        }

        .modal--close {
            text-align: right;
            cursor: pointer;
        }

        .modal-container {
            button {
                margin-top: 0px;
                width: 250px;
            }

            h1 {
                margin: 5px 10px;
            }

            h5 {
                margin: 5px 10px;
            }

            .input-container {
                .input-options-type-schedule {
                    visibility: hidden;
                    width: 1px;
                    height: 1px;
                }

                .input-options-network-active {
                    visibility: hidden;
                    width: 1px;
                    height: 1px;
                }

                .input-options-user-autenticate {
                    visibility: hidden;
                    width: 1px;
                    height: 1px;
                }

                .input-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0;
                    width: 400px;
                    margin: 0;

                    .radio-options {
                        margin-left: 0;
                        padding-left: 0;
                        width: 100px;
                        height: 100px;
                        align-items: left;
                        justify-content: left;

                        label {
                            padding: 0 0px 0 50px;
                        }
                    }
                        
                    .input-options-send-files {
                        .view-schedules-files {
                            div {
                                overflow:auto;
                                height: 50px;
                            }
                        }
                        
                        .filesSchedules {
                            input [type="file"] {
                                display: none;
                            }
                        }
                    }

                    .input-options--textarea-legend {
                        textarea {
                            width: 500px;
                            height: 200px;
                        }
                    }

                    .input-options-date-time {
                        margin: 0;
                    }
                }
            }

            .loading-container {
                margin-top: 10px;
                margin-bottom: 10px;
            }

            .alert-container--not-valid, .alert-container--valid {
                border: 1px solid @orange-black;
                border-radius: 8px;

                h1 {
                    margin: 15px;
                    font-size: 20px;
                }
            }
        }

        @media @tablets {
            &--content {
                width: 90%;
                padding: 15px;
            }
        }
    }
</style>