import ContextMenu from './ContextMenu.vue'
import ContextMenuItem from './ContextMenuItem.vue'

export default {
  install (app) {
    app.component(ContextMenu.name, ContextMenu)
    app.component(ContextMenuItem.name, ContextMenuItem)
  },
}

/*
 import ContextMenu from "@/ext/Shared/ContextMenu"
 app.use(ContextMenu)
 
 <!--  <context-menu ref="contextMenu">-->
 <!--    <context-menu-item @click="">a</context-menu-item>-->
 <!--    <context-menu-item>b</context-menu-item>-->
 <!--    <context-menu-item sub-menu>-->
 <!--      <span>c</span>-->
 <!--      <template #sub-menu>-->
 <!--        <context-menu-item>c1</context-menu-item>-->
 <!--        <context-menu-item>c2</context-menu-item>-->
 <!--        <context-menu-item>-->
 <!--          <span>c3</span>-->
 <!--          <template #sub-menu>-->
 <!--            <context-menu-item>c31</context-menu-item>-->
 <!--            <context-menu-item>c32</context-menu-item>-->
 <!--            <context-menu-item>c33</context-menu-item>-->
 <!--          </template>-->
 <!--        </context-menu-item>-->
 <!--      </template>-->
 <!--    </context-menu-item>-->
 <!--    <context-menu-item>d</context-menu-item>-->
 <!--  </context-menu>-->
 <!--  <span @contextmenu.prevent="$refs.contextMenu.openMenu">showContextMenu</span>-->
 */