const electron = require('electron');
const settings = electron.remote.require('electron-settings');

function init () {
  const injectScript = (src) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);
  };

  const injectStylesheet = (src) => {
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = src;
    document.head.appendChild(link);
  };

  const cssPath = require.resolve("pure-form/dist/pure-form.min.css");
  const jsPath = require.resolve("pure-form/dist/pure-form.min.js");
  injectStylesheet(cssPath);
  injectScript(jsPath);
}

function createForm (srcPath, container = document.body) {
  const el = document.createElement('pure-form');
  el.setAttribute('id', 'electron-config-form');
  el.setAttribute('src', srcPath)
  el.setAttribute('validate-on-blur', true);
  container.appendChild(el);
  return el;
}

// TODO: add a way to define shema directly instead of using a filepath. Try using form.schema
function run ({srcPath, container}) {
  init();

  if (typeof container === "string") {
    container = document.querySelector(container);
  }
  const form = createForm(srcPath, container);

  const loadData = () => {
    const config = settings.getAll();
    form.value = config;
  };

  form.addEventListener('pure-form-render-complete', loadData);
  settings.watch("", loadData);

  // Run directly when validation is passed
  form.addEventListener('pure-form-validation-passed', function(e) {
    settings.setAll(e.target.value);
  });
}

module.exports = run;
