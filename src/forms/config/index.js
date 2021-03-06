// import Custom from './custom.vue'
import Input from './input.vue'
import InputTable from './input-table.vue'
import Textarea from './textarea.vue'
import Number from './number.vue'
import Dynamic from './dynamic.vue'
import Switch from './switch.vue'
import Rate from './rate.vue'
import Slider from './slider.vue'
import Color from './color.vue'
import Radio from './radio.vue'
import Checkbox from './checkbox.vue'
import Select from './select.vue'
import Cascader from './cascader.vue'
import Tree from './tree.vue'
import Date from './date.vue'
import Upload from './upload.vue'
import UEditor from './ueditor.vue'
import Map from './map.vue'
import Group from './group.vue'
import Array from './array.vue'
import Title from './title.vue'
import Button from './button.vue'
import MyButton from './mybutton.vue'
import Divider from './divider.vue'
import Warning from './warning.vue'
import Table from './table.vue'
import Crud from './crud.vue'

const components = [
  // Custom,
  InputTable,
  Input,
  Textarea,
  Number,
  Dynamic,
  Switch,
  Rate,
  Slider,
  Color,
  Radio,
  Checkbox,
  Select,
  Cascader,
  Tree,
  Date,
  UEditor,
  Upload,
  Map,
  Group,
  Array,
  Title,
  Button,
  MyButton,
  Divider,
  Warning,
  Table,
  Crud
]

const Config = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      // console.log(component.name)
      Vue.component(component.name, component);
    })
  }
}

export default Config
