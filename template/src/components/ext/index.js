// import ExtElementPlus from './element-plus'

// import Sticky from './Sticky'
// import ContextMenu from './ContextMenu'
// import DragSizeContainer from './DragSizeContainer'
import SvgIcon from './SvgIcon'

export default {
  install(app) {
    // app.use(ExtElementPlus)
    
    // app.use(Sticky)
    // app.use(ContextMenu)
    // app.component(DragSizeContainer.name, DragSizeContainer)
    app.component(SvgIcon.name, SvgIcon)
  }
}