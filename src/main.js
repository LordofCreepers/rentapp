import { createApp } from 'vue'
import App from './App.vue'
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faXmark, faCheck, faPlus, faCaretDown, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
library.add( faFloppyDisk )
library.add( faCaretDown )
library.add( faPlus )
library.add( faTrashCan )
library.add( faXmark )
library.add( faCheck )

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
