import StatusBar from "./StatusBar";
import StatisticsBar from "./StatisticsBar";
import SideBar from "./SideBar";
import LayBar from "./LayBar";
import Operate from "./Operate";
import ImgElement from "./Element/ImgElement";
import WordElement from "./Element/WordElement";
import LayerPicker from "./LayerPicker";
import LayoutPicker from "./LayoutPicker";
import LayoutItem from "./LayoutItem";
import Editor from "./Editor";

const components = {
  StatusBar,
  StatisticsBar,
  SideBar,
  LayBar,
  Operate,
  ImgElement,
  WordElement,
  LayerPicker,
  LayoutPicker,
  LayoutItem,
  Editor
};

const install = (Vue, options = {}) => {
  if (install.installed) return;
  Object.keys(components).forEach(component => {
    Vue.component(components[component].name, components[component]);
  });
  install.installed = true;
};
install.installed = false;
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
  install.installed = true;
}

const Vcomp = {
  ...components,
  install
};

export default Vcomp;
