<template>
      <div class="modal" v-if="show">
            <div class="modal--content">
                  <div class="modal--close" v-html="closeIcon" @click="onCloseButtonClick"></div>
                  <div class="modal-container">
                        <h1>Atualizar informações</h1>
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
                                    v-model="getUpdateLegend"
                              />
                        </div>
                        <div class="input-options-date-time">
                              <p class="input-options-date-label">Data:</p>
                              <input class="input-options-date" name="input-options-date" type="date" id="input-options-date" :min="getMinDate" @change="handleDate($event)" :value="getUpdateDate"/>
                              <p class="input-options-time-label">Horário:</p>
                              <input class="input-options-time" name="input-options-time" type="time" id="input-options-time" @change="handleTime($event)" :value="getUpdateTime"/>
                        </div>
                        <button class="secondary-button"  @click="onCloseButtonClick">Cancelar</button>
                        <button class="primary-button-submit" @click="onUpdateSchedule">Atualizar</button>
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
import moment from 'moment'
import axios from 'axios'
export default {
      props: {
            show: {
                  type: Boolean,
                  default: false
            },
            updateSchedule: {
                  type: []
            }
      },
      data() {
            return {
                  date: this.getUpdateDate(),
                  time: this.getUpdateTime(),
                  legend: this.getUpdateLegend()
            }
      },
      components: {
            Loading
      },
      mixins: [Mixin],
      computed: {
            closeIcon() {
                  return feather.icons.x.toSvg();
            },
            urlFile() {
                  return `${this.urlAPI()}/save_schedule`
            },
            getUpdateLegend() {
                  return this.updateSchedule['legend'];
            },
            getUpdateDate() {
                  return moment(this.updateSchedule['date_schedule']).format('YYYY-MM-DD');
            },
            getUpdateTime() {
                  return moment(this.updateSchedule['date_schedule']).format('HH:MM');
            },
            getMinDate() {
                  return moment(new Date()).format('YYYY-MM-DD');
            }
      },
      methods: {
            onCloseButtonClick() {
                  this.$emit('hideUpdateModal')
                  this.$props.show = false;
            },
            handleDate(event) {
                  this.date = event.target.value;
            },
            handleTime(event) {
                  this.time = event.target.value;
            },
            handleLegend(event) {
                  this.legend = event.target.value;
            },
            onUpdateSchedule() {
                  return new Promise (()=>{
                        axios.put(`${this.urlAPI()}/update_schedule`,{date: this.date, time: this.time, legend: this.legend, idqueue: this.updateSchedule['id_queue']}).then( () => {
                              console.log("entrou")
                              this.onCloseButtonClick();
                        })
                  })
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

            .modal-container {
                  button {
                        margin-top: 0px;
                        width: 250px;
                  }
            }

            .input-container {
                  .input-options-type-schedule, .input-options-network-active {
                        visibility: hidden;
                        width: 1px;
                        height: 1px;
                  }
            }

            &--content {
                  background: white;
                  border-radius: 8px;
                  width: 600px;
                  padding: 30px;
                  position: absolute;
                  top: 50%;
                  right: 50%;
                  transform: translate(50%, -50%);
            }

            &--close {
                  text-align: right;
                  cursor: pointer;
            }

            @media @tablets {
                  &--content {
                        width: 90%;
                        padding: 15px;
                  }
            }
      }
</style>