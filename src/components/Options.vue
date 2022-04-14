<template>
      <div class="options-container">
            <div class="logoff" v-html="lofoffIcon" @click="returnLogin"></div>
      </div>
</template>

<script>
import feather from 'feather-icons'
export default {
      data(){
            return {
                  showPerfilModal: false,
            }
      },
      components: {

      },
      methods: {
            returnLogin() {
                  document.location.reload(true);
            }
      },
      computed: {
            lofoffIcon() {
                  return feather.icons['log-out'].toSvg();
            }
      }
}
</script>

<style lang="less" scoped>
      .options-container {
            height: 100vh;
            display: flex;
            flex-direction: column;

            svg {
                  margin-right: 1%;
                  margin-top: 0.5%;
                  cursor: pointer;
                  height: fit-content;
                  border: 1px solid black;
                  border-radius: 8px;
            }

            .logoff {
                  cursor: pointer;
            }
      }

</style>