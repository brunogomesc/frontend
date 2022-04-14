<template>
    <div class="modal" v-if="show">
        <div class="modal--content">
            <div class="modal--close" v-html="closeIcon" @click="onCloseButtonClick"></div>
                <div class="modal-content">
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
                    <div class="radio-container">
                        <div class="radio-options">
                            <input type="radio" name="network-insta" id="instagram" value="instagram" v-model="networkType">
                            <label for="instagram">Instagram</label>
                        </div>
                        <!-- <div class="radio-options">
                            <input type="radio" name="network-twitter" id="twitter" value="twitter" v-model="networkType">
                            <label for="twitter">Twitter</label>
                        </div> -->
                    </div>
                </div>
                <button class="secondary-button" @click="onCloseButtonClick">Cancelar</button>
                <button class="primary-button" @click="validateUser">Adicionar</button>
                <div class="loading-container">
                    <Loading v-if="isLoading"/>
                </div>
                <div class="alert-container--valid" v-if="userAutenticateNetwork">
                    <h1 class="alert-container--info">Usuário validado e dados cadastrados com sucesso</h1>
                </div>
                <div class="alert-container--not-valid" v-else-if="userNotAutenticateNetwork">
                    <h1 class="alert-container--info">Usuário não validado, por favor verificados se os dados de acesso e o tipo de rede social estão corretos</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import feather from 'feather-icons'
import axios from 'axios'
import Mixin from '@/mixins/mixins'
import Loading from '../components/Loading.vue'
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
            networkType: 'instagram',
            isLoading: false,
            userAutenticateNetwork: false,
            userNotAutenticateNetwork: false,
            userAutenticateInfos: [],
            networkAutenticateInfos: [{}],
            result: {},
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
    computed: {
        closeIcon() {
            return feather.icons.x.toSvg();
        },
        isCreateRegisterNewtorkValid() {
            let isValid = true;
            isValid &= this.formNetworkData.user.valid;
            isValid &= this.formNetworkData.pass.valid;
            return isValid;
        }
    },
    methods: {
        onCloseButtonClick() {
            this.$emit('on-modal-close')
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
        getUserAutenticate() {
            return this.$store.state.userAutenticate;
        },
        async saveUserNetworkDatabase(){
            this.userAutenticateInfos = this.getUserAutenticate()
            this.networkAutenticateInfos = {'user': this.formNetworkData.user.value, 'pass': this.formNetworkData.pass.value, 'icon': this.networkType, 'id': this.networkType}
            await axios.post(`${this.urlAPI()}/register/user_network`, 
            {
                user: this.formNetworkData.user.value, 
                password: this.formNetworkData.pass.value, 
                network: this.networkType, 
                id_login: this.userAutenticateInfos[0]['id_login']
            })
            .then((response) => {
                if(response.status == 200) {
                    this.clearFormRegisterNetwork();
                    this.$store.dispatch("saveNetworksRegisters", this.networkAutenticateInfos)
                    this.onCloseButtonClick();
                }   
            });
        },
        validateNetworkForm() {
            this.formNetworkData.user.isValid();
            this.formNetworkData.pass.isValid();
        },
        saveUser(autenticate) {
            if(autenticate) {
                this.saveUserNetworkDatabase();
            }
            else {
                this.clearFormRegisterNetwork();
            }
        },
        validateUser() {
            this.validateNetworkForm();
            this.userAutenticateNetwork = false;
            this.userNotAutenticateNetwork = false;
            return new Promise (()=>{
                if(this.isCreateRegisterNewtorkValid) {
                    this.isLoading = true;
                    axios.get(`${this.urlAPI()}/auth/social_network`, { params:{
                        'user': this.formNetworkData.user.value,
                        'password': this.formNetworkData.pass.value, 
                        'network': this.networkType
                    }}).then( response => {
                        this.isLoading = false;
                        this.result = response.data;
                        if(this.result['autenticate'] == 1) {
                            this.userAutenticateNetwork = true;
                            this.saveUser(true);
                            return;
                        }
                        this.userAutenticateNetwork = false;
                        this.userNotAutenticateNetwork = true;
                        this.saveUser(false);
                        return;
                    })
                }
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

    .modal-content {
        button {
            margin-top: 40px;
            width: 250px;
        }

        .network-container {
            display: flex;
            flex-direction: column;

            .radio-container {
                display: flex;
                .radio-options {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-left: -30px;
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
</style>