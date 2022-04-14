<template>
      <div class="form-login">
            <form>
                  <div class="input-field">
                        <label for="">{{this.formLoginData.user.label}}</label>
                        <input type="text" :placeholder="this.formLoginData.user.placeholder" v-model="formLoginData.user.value" @blur="formLoginData.user.isValid()">
                        <p class="error-message" v-if="!formLoginData.user.valid">{{this.formLoginData.user.errorMessage}}</p>
                  </div>
                  <div class="input-field">
                        <label for="">{{this.formLoginData.pass.label}}</label>
                        <input type="password" :placeholder="this.formLoginData.pass.label" v-model="formLoginData.pass.value" @blur="formLoginData.pass.isValid()" v-on:keyup.enter="validateUserInfos">
                        <p class="error-message" v-if="!formLoginData.pass.valid">{{this.formLoginData.pass.errorMessage}}</p>
                  </div>
            </form>
            <button class="primary-button" @click="validateUserInfos">Acessar</button>
            <a @click="createdAccount">Criar conta</a>
            <Modal :show="showCreatedModal" @on-modal-close="hideCreatedModal">
                  <div class="modal-content">
                        <h1>Criar conta</h1>
                        <div class="account-container">
                              <div class="input-field">
                                    <label for="">{{formAccountData.name.label}}</label>
                                    <input type="text" :placeholder="formAccountData.name.placeholder" v-model="formAccountData.name.value" @blur="formAccountData.name.isValid()" :class="{'error' : !formAccountData.name.valid}">
                                    <p class="error-message" v-if="!formAccountData.name.valid">{{formAccountData.name.errorMessage}}</p>
                              </div>
                              <div class="input-field">
                                    <label for="">{{formAccountData.user.label}}</label>
                                    <input type="text" :placeholder="formAccountData.user.placeholder" v-model="formAccountData.user.value" @blur="formAccountData.user.isValid()" :class="{'error' : !formAccountData.user.valid}">
                                    <p class="error-message" v-if="!formAccountData.user.valid">{{formAccountData.user.errorMessage}}</p>
                              </div>
                              <div class="input-field">
                                    <label for="">{{formAccountData.pass.label}}</label>
                                    <input type="password" :placeholder="formAccountData.pass.placeholder" v-model="formAccountData.pass.value" @blur="formAccountData.pass.isValid()" :class="{'error' : !formAccountData.pass.valid}">
                                    <p class="error-message" v-if="!formAccountData.pass.valid">{{formAccountData.pass.errorMessage}}</p>
                              </div>
                              <div class="input-field">
                                    <label for="">{{formAccountData.email.label}}</label>
                                    <input type="email" :placeholder="formAccountData.email.placeholder" v-model="formAccountData.email.value" @blur="formAccountData.email.isValid()" :class="{'error' : !formAccountData.email.valid}">
                                    <p class="error-message" v-if="!formAccountData.email.valid">{{formAccountData.email.errorMessage}}</p>
                              </div>
                        </div>
                        <div class="button-container">
                              <button class="secondary-button" @click="hideCreatedModal">Cancelar</button>
                              <button class="primary-button" @click="validateCreatedAccount">Criar Conta</button>
                        </div>
                  </div>
            </Modal>
            <Modal :show="userInvalid" @on-modal-close="hideInvalidModal">
                  <div class="autenticate-modal">
                        <span v-html="invalidIcon" class="icon"></span>
                        <span>Usuário e/ou senha não existentes na base de dados.</span>
                  </div>
            </Modal>
      </div>
</template>

<script>
import axios from 'axios'
import Mixin from '@/mixins/mixins'
import Modal from '../components/Modal.vue'
import feather from 'feather-icons'

export default {
      name: 'FormLogin',
      mixins: [Mixin],
      components: {
            Modal
      },
      data() {
            return {
                  usersLogin: [],
                  userAutenticate: [],
                  networkLists: [],
                  userValidate: false,
                  userInvalid: false,
                  showCreatedModal: false,
                  formLoginData: {
                        user: {
                              value: '',
                              placeholder: 'Login',
                              errorMessage: 'Login inválido',
                              label: 'Login',
                              valid: true,
                              isValid: () => {
                                    this.formLoginData.user.valid = !!this.formLoginData.user.value.length;
                              }
                        },
                        pass: {
                              value: '',
                              placeholder: 'Senha',
                              errorMessage: 'Senha inválida',
                              label: 'Senha',
                              valid: true,
                              isValid: () => {
                                    this.formLoginData.pass.valid = !!this.formLoginData.pass.value.length;
                              }
                        },
                  },
                  formAccountData: {
                        user: {
                              value: '',
                              placeholder: 'Digite seu usuário',
                              errorMessage: 'O usuário é obrigatório',
                              label: 'Uuário *',
                              valid: true,
                              isValid: () => {
                                    this.formAccountData.user.valid = !!this.formAccountData.user.value.length;
                              }
                        },
                        name: {
                              value: '',
                              placeholder: 'Digite seu nome',
                              errorMessage: 'O nome é obrigatório',
                              label: 'Nome *',
                              valid: true,
                              isValid: () => {
                                    this.formAccountData.name.valid = !!this.formAccountData.name.value.length;
                              }
                        },
                        email: {
                              value: '',
                              placeholder: 'Digite seu email',
                              errorMessage: 'O email é obrigatório',
                              label: 'Email *',
                              valid: true,
                              isValid: () => {
                                    this.formAccountData.email.valid = !!this.formAccountData.email.value.length;
                              }
                        },
                        pass: {
                              value: '',
                              placeholder: 'Digite sua senha',
                              errorMessage: 'A senha é obrigatória',
                              label: 'Senha *',
                              valid: true,
                              isValid: () => {
                                    this.formAccountData.pass.valid = !!this.formAccountData.pass.value.length;
                              }
                        }
                  }
            }
      },
      computed: {
            getInfoUser() {
                  return this.formLoginData.user.value;
            },
            invalidIcon() {
                  return feather.icons['x-octagon'].toSvg();
            },
            isUserInputLoginValid() {
                  let isValid = true;
                  isValid &= this.formLoginData.user.valid;
                  isValid &= this.formLoginData.pass.valid;
                  return isValid;
            },
            isCreatedAccountInputValid() {
                  let isValid = true;
                  isValid &= this.formAccountData.user.valid;
                  isValid &= this.formAccountData.pass.valid;
                  isValid &= this.formAccountData.email.valid;
                  isValid &= this.formAccountData.name.valid;
                  return isValid;
            }
      },
      methods: {
            triggersInputLoginValidations() {
                  this.formLoginData.user.isValid();
                  this.formLoginData.pass.isValid();
            },
            hideInvalidModal() {
                  this.userInvalid = false;
                  this.formLoginData.user.value = '';
                  this.formLoginData.pass.value = '';
            },
            validateUserInfos() {
                  this.triggersInputLoginValidations();
                 
                  if(this.isUserInputLoginValid){
                        var user = this.formLoginData.user.value;
                        var pass = this.formLoginData.pass.value;
                        axios.get(`${this.urlAPI()}/auth`).then( response => {
                              this.usersLogin = response.data;
                              for (let index = 0; index < this.usersLogin.length; index++) {
                                    if(this.usersLogin[index]['user_login'] == user && this.usersLogin[index]['password_login'] == pass && this.usersLogin[index]['ativo'] == 1) {
                                          this.userValidate = true;
                                          this.userAutenticate = this.usersLogin[index]
                                          this.addUserAutenticate();
                                          this.saveNetworkSaved();
                                          this.$router.push({name: 'Homepage'})
                                    }
                                    else {
                                          this.userInvalid = true;
                                          this.formLoginData.user.valid = false;
                                          this.formLoginData.pass.valid = false;
                                    }
                              }
                        })
                 }
            },
            addUserAutenticate() {
                  this.$store.dispatch('saveUserAutenticate', this.userAutenticate)
                  //this.saveNetworkSaved();
            },
            createdAccount() {
                  this.showCreatedModal = true;
            },
            hideCreatedModal() {
                  this.formAccountData.user.value = '';
                  this.formAccountData.email.value = '';
                  this.formAccountData.pass.value = '';
                  this.formAccountData.name.value = '';
                  this.showCreatedModal = false;
            },
            validateAccountForm() {
                  this.formAccountData.user.isValid();
                  this.formAccountData.email.isValid();
                  this.formAccountData.pass.isValid();
                  this.formAccountData.name.isValid();
            },
            async validateCreatedAccount() {
                  this.validateAccountForm();

                  if(this.isCreatedAccountInputValid){
                        var user = this.formAccountData.user.value;
                        var pass = this.formAccountData.pass.value;
                        var email = this.formAccountData.email.value;
                        var name = this.formAccountData.name.value;

                        await axios.post(`${this.urlAPI()}/register/user_account`, {user: user, password: pass, email: email, name: name})
                        .then((response) => {
                              if(response.status == 200) {
                                    this.hideCreatedModal();
                              }   
                        });
                  }
            },
            saveNetworkSaved() {
                  return new Promise (()=>{
                        axios.get(`${this.urlAPI()}/auth/social_network_save`, { params:{
                              'id_login': this.userAutenticate['id_login'],
                              }}).then( response => {
                                    this.networkLists = response.data;
                                    if(this.networkLists.length != 0) {
                                          this.$store.dispatch('saveNetworksRegisters', this.networkLists[0])
                                          return;
                                    }
                                    return;
                              }
                        )
                  }) 
            }
      }
}
</script>

<style lang="less" scoped>
      .form-login {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            border: solid 3px @orange-black;
            border-radius: 8px;
            padding: 25px;

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

            .input-field {
                  display: flex;
                  flex-direction: column;
                  width: fit-content;

                  .error-message {
                        font-size: 15px;
                        color: @orange-black;
                        font-weight: normal;
                        margin: 2px 0px 10px 50px;
                  }

                  input {
                        font-weight: bold;
                        margin: 5 10px;
                  }

                  label {
                        font-weight: 300;
                        color: @orange-light;
                  }

            }

            .modal-content {
                 input {
                        font-weight: bold;
                        margin: 5 10px;
                        width: 400px;
                  }

                  label {
                        font-weight: 500;
                        color: @orange-black;
                  } 
            }

            .button-container {
                  margin-top: 50px;

                  button {
                        width: 250px;
                  }
            }

            a {
                  margin-top: 30px;
                  cursor: pointer;
                  text-decoration: underline;
                  color: @orange-black;
                  width: fit-content;
            }

      }
</style>
