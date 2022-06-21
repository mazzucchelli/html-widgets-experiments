function addCodeExample(component, templateConfig) {
    if(!component || !templateConfig) return
    component.parameters = {
      docs: {
        source: {
          code: templateConfig({
            label: component?.args?.label,
            className: component?.args?.className
          })
        }
      }
    }
    return component
  }
  export { addCodeExample }