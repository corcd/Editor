import StatusBar from "./StatusBar";
import SideBar from "./SideBar";
import Operate from "./Operate";
import ImgElement from "./Element/ImgElement";
import Editor from "./Editor";

const components = {
  StatusBar,
  SideBar,
  Operate,
  ImgElement,
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