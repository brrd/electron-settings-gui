const electron = require('electron');
const settings = electron.remote.require('electron-settings');

// TODO: replace callback by promise
function injectAssets () {
  const cssPath = require.resolve("pure-form/dist/pure-form.min.css");
  const jsPath = require.resolve("pure-form/dist/pure-form.min.js");

  const injectScript = (src, callback) => {
    const script = document.createElement('script');
    document.head.appendChild(script);
    script.onload = callback;
    script.src = src;
  };

  const injectStylesheet = (src) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = src;
    document.head.appendChild(link);
  };

  // TODO: reject => Error
  return new Promise ((resolve, reject) => {
    injectStylesheet(cssPath);
    injectScript(jsPath, resolve);
  });
}

function createForm ({schema, schemaPath, container, id}) {
  const el = document.createElement('pure-form');
  el.setAttribute('id', id);
  if (schema) {
    el.schema = schema;
  } else if (schemaPath) {
    el.setAttribute('src', schemaPath);
  }
  el.setAttribute('validate-on-blur', true);
  container.appendChild(el);
  return el;
}

function main ({schema, schemaPath, container = document.body, id = 'electron-config-form'}) {
  return injectAssets().then(() => {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }
    const form = createForm({schema, schemaPath, container, id});

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

    return form;
  });
}

module.exports = main;
