<template>
      <div class="login">
            <div class="logo">
                  <h1 class="title-logo">Post At Time</h1>
                  <Logo/>
            </div>
            <div class="form-login-container">
                  <FormLogin/>
            </div>
            <Loading v-if="isLoading"/>
      </div>
</template>

<script>
import Logo from '../assets/icons/LogoPostAtTime.svg'
import FormLogin from '../components/FormLogin.vue'
import Loading from '../components/Loading.vue'
export default {
      name: 'Login',
      components: {
            FormLogin,
            Loading,
            Logo
      },
      data() {
            return {
                  isLoading: false,
            }
      }
}
</script>

<style lang="less" scoped>
      .login {
            display: flex;
            margin: 0;
            justify-content: space-between;

            .logo {
                  display: flex;
                  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                  font-size: 70px;
                  position: relative;
                  margin-left: 200px;
                  margin-top: 100px;

                  .title-logo {
                        h1 {
                              display: flex;
                              align-items: self-end;
                              color: @orange-black;
                        }
                  }

                  svg {
                        position: absolute; 
                        right: 0;
                        margin-top: 50px;
                  }

            }

            .form-login-container {
                  margin-top: 15%;
                  margin-right: 15%;
            } 

      }
</style>