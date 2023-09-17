const makeScriptForFilling = (form = null, toClipboard = false) => {
  const elementsSelector = 'input:not([type="hidden"]), select, textarea';

  const makeScriptForFillingInputs = (form = null) => {
    let script = '';
    const inputs = form
      ? form.querySelectorAll(elementsSelector)
      : document.querySelectorAll(elementsSelector);

    if (!inputs.length) {
      return '';
    }

    script = Array.from(inputs).reduce((script, input, index) => {
      script += makeScriptForInput(input, index);
      return script;
    }, script);

    return script;
  };

  const makeScriptForInput = (input, index) => {
    let script, inputValue, attributeName;

    if (input.type === 'checkbox' || input.type === 'radio') {
      attributeName = 'checked';
      inputValue = input.checked;
    } else {
      attributeName = 'value';
      inputValue = input.value.replaceAll(/(?<!\\)\'/g, "\\'");
    }

    if (input.id) {
      script = `document.getElementById('${input.id}').${attributeName} = '${inputValue}';\n`;
    } else if (form) {
      const formSelector = getFormSelector(form);
      script = `${formSelector}.elements[${index}].${attributeName} = '${inputValue}';\n`;
    } else {
      script = `document.querySelectorAll('${elementsSelector}')[${index}].${attributeName} = '${inputValue}';\n`;
    }

    return script;
  };

  const getFormSelector = (form) => {
    if (form.id) {
      formSelector = `document.getElementById('${form.id}')`;
    } else {
      formIndexOnPage = document.getElementsByTagName('form').indexOf(form);
      formSelector = `document.getElementsByTagName('form')[${formIndexOnPage}]`;
    }

    return formSelector;
  };

  const script = makeScriptForFillingInputs(form ?? null);

  if (toClipboard) {
    navigator.clipboard.writeText(script);
  }

  return script;
};
