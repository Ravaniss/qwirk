<template>
  <div id="leftBar">
    <transition name="fade">
      <new-or-join-server
        v-if="modal.newServeur"
        @close="setModal('newServeur', false)">
      </new-or-join-server>
    </transition>

    <h1>QWIRK</h1>
    <router-link :to="{name: 'landing-page'}"
                 class="chan set" tag="div">
      <div class="logo"></div>
    </router-link>
    <div class="separator"></div>
    <div class="servers">
      <draggable v-model="getServers">
        <div class="server" v-for="server in getServers">
          <router-link @click.native="choiceServer(server)"
                       :to="{name: 'server', params: { serverId: server.id, type: 'public' }}"
                       class="chan set" tag="div">
            <avatar :url="server.icon" size="medium" class="avatar-server"></avatar>
            <div style="color: #FFF;">{{ server.waitMsg }}</div>
          </router-link>
        </div>
      </draggable>
    </div>
    <button class="groupAdd" @click="setModal('newServeur', true)">
      <span class="icon">+</span>
    </button>
    <button class="groupAdd">
      <svg name="Search" width="24" height="24" viewBox="0 0 18 18">
        <g fill="none" fill-rule="evenodd">
          <path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path>
        </g>
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
const draggable: any = require('vuedraggable')
import { Store, mapGetters, mapActions } from 'vuex'

import Avatar from './Contents/components/Avatar.vue'
import NewOrJoinServer from './Modals/NewOrJoinServer.vue'
import { ComponentOptions } from 'vue'

@Component({
  components: {
    draggable,
    Avatar,
    NewOrJoinServer
  },
  Store,
  computed: {
    ...mapGetters([
      'getServers',
      'user'
    ])
  },
  methods: {
    ...mapActions([
      'setServer',
      'setServers'
    ])
  },
  sockets: {
    updateServers (servers: any) {
      this.setServers(servers.map((server: any) => {
        const ch = server
        ch.waitMsg = 0
        return ch
      }))
    }
  }
} as ComponentOptions<ServersBar>)
export default class ServersBar extends Vue {
  @Watch('user')
  public onUserChanged(val: any, oldVal: any) {
    if (val !== null) {
      this.$socket.emit('GET::SERVERS', val.id)
    }
  }

  private user!: any
  private modal: any = {
    newServeur: false
  }

  public setModal(modalName: string, value: boolean) {
    this.modal[modalName] = value
    this.$emit('test', this.modal)
  }

  public choiceServer(server) {
    this.setServer(server)
    this.$socket.emit('GET::CHANNELS::NAME', server.id)
    this.$socket.emit('GET::USERS', server.id)
  }

}
</script>

<style lang="scss" scoped>
  h1 {
    font-size: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #FFF;
  }

  div.logo {
    background-image: url('../assets/logos/Qwirk.png');
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position-y: 0;
    background-size: 50px 60px;
    transition: border-radius .15s ease-out;

    &:hover {
      cursor: pointer;
      border-radius: 38%;
    }
  }

  div.chan.set.router-link-active:before {
    background: #FFF;
    border-radius: 20px;
    content: " ";
    position: absolute;
    width: 10px;
    height: 40px;
    left: -5px;
    margin-top: 5px;
  }

  #leftBar {
    width: 70px;
    background-color: #202225;
    display: flex;
    flex-direction: column;
    align-items: center;

    div.friendsOnline {
      color: hsla(0,0%,100%,.3);
      font-size: 10px;
      margin-top: 10px;
      text-align: center;
      text-transform: uppercase;
    }

    > div.separator {
      background-color: hsla(0, 0%, 100%, .1);
      width: 1px;
      height: 22px;
      flex-shrink: 0;
      transform: rotate(90deg);
    }

    div.servers {
      div.server {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        margin-top: 5px;

        &:hover {
          cursor: pointer;
        }

        &:first-child { margin-top: 0; }

        div.chan.set {
          position: relative;

          img {
            transition: border-radius .15s ease-out;
            &:hover {
              border-radius: 38%;
            }
          }
        }

        div.chan.set.router-link-active:before {
          background: #FFF;
          border-radius: 20px;
          content: " ";
          position: absolute;
          width: 10px;
          height: 40px;
          left: -14px;
          margin-top: 5px;
        }
      }
    }

    button.groupAdd {
      background-color: #202225;
      color: #43b581;
      margin-top: 8px;
      border-radius: 50%;
      border: 1px dashed #43b581;
      font-size: 40px;
      font-weight: 300;
      height: 50px;
      line-height: 100%;
      padding: 0;
      text-align: center;
      transition: border-radius .15s ease-out,background-color .15s ease-out;
      width: 50px;
      margin-right: 0;

      &:hover {
        background-color: #43b581;
        color: hsla(0,0%,100%,.75);
        border-radius: 38%;
      }
    }

    .avatar.avatar-server.avatar-medium {
      transition: border-radius .15s ease-out;

      &:hover {
        border-radius: 38%;
      }
    }
  }

  section.chan {
    display: flex;
    align-items: center;
    padding: 8px 4px;
    font-size: 16px;
    color: #f6f6f7;
    text-align: center;
    border: none;
    cursor: pointer;
    transition: all 200ms ease;
    border-radius: 2px;
    margin-right: 10px;

    > div {
      width: 30px;
      height: 30px;
      opacity: 0.6;
      transition: opacity .05s;
      margin-right: 12px;
    }

    > a {
      height: 100%;
      width: 100%;
      text-align: left;
      padding: 8px 0;
    }

    &.set {
      justify-content: space-between;
      margin-left: 10px;
    }
  }
</style>
