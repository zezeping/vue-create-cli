// import elementPlus from './elementPlus'
// import antDesign from './antDesign'
// import Echarts from './Echarts'

// import Sticky from './Sticky'
// import ContextMenu from './ContextMenu'
// import DragSizeContainer from './DragSizeContainer'
import SvgIcon from './SvgIcon'

export default {
  install(app) {
    // app.use(elementPlus)
    // app.use(antDesign)
    // app.use(Echarts)
    
    // app.use(Sticky)
    // app.use(ContextMenu)
    // app.component(DragSizeContainer.name, DragSizeContainer)
    app.component(SvgIcon.name, SvgIcon)
  }
}