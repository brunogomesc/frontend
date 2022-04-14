<template>
      <div class="functions-menu">
            <ul>
                  <li
                        v-for="functions in functionsList"
                        :key="functions.id"
                        @click="onFunctionClick(functions.id)"
                        :class="{ 'active': isActive(functions.id) }"
                  >
                        <component :is="functions.icon" />
                        <p>{{ functions.label }}</p>
                  </li>
            </ul>
      </div>
</template>

<script>
import Search from "../assets/icons/search.svg";
import Globe from "../assets/icons/globe.svg"
import CreateSchedule from "../assets/icons/calendar.svg";

export default {
      name: "FunctionsMenu",
      components: {
            CreateSchedule,
            Search,
            Globe
      },
      data() {
            return {
                  functionsList: [
                        { label: "Criar Agendamento", icon: "CreateSchedule", id: "create" },
                        { label: "Visualizar Agendamento", icon: "Search", id: "view" },
                        { label: "Visualizar Redes Sociais", icon: "Globe", id: "network" },
                  ],
                  selectedFunction: '',
            };
      },
      mounted() {
            this.onFunctionClick('create');
      },
      methods: {
            onFunctionClick(id) {
                  this.selectedFunction = id;
                  this.$store.dispatch('changeFunction', id); 
            },
            isActive(id) {
                  return this.selectedFunction === id;
            },

      },
};
</script>

<style lang="less" scoped>
      .functions-menu {
            min-width: 120px;
            width: 130px;
            height: 100vh;
            background: @orange-black;
            display: flex;
            align-items: center;

            ul {
                  list-style: none;
                  padding: 0px;
                  width: 100%;

                  li {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100px;
                        margin: 5px;

                        p {
                              margin-top: 10px;
                              font-weight: 400;
                              font-size: 14px;
                              color: black;
                              padding: 5px;
                        }

                        &.active {
                              background: @orange-light;
                              border-radius: 8px;
                              border: 1px solid black;

                              p {
                                    color: black;
                                    font-weight: 600;
                              }

                        }
                  }
            }

            @media @tablets {
                  width: 100%;
                  height: fit-content;

                  ul {
                        display: flex;
                        margin: 20px;
                        overflow: scroll;

                        li {
                        min-width: 78px;
                  }
            }
      }
}
</style>
