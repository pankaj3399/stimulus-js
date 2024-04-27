// src/stimulus.js
import escapeHtml from "escape-html";

class StimulusAttributes {
  constructor(env) {
    this.attributes = {};
    this.controllers = [];
    this.actions = [];
    this.targets = [];
    this.env = env;
  }

  addController(
    controllerName,
    controllerValues = {},
    controllerClasses = {},
    controllerOutlets = {}
  ) {
    controllerName = this.normalizeControllerName(controllerName);
    this.controllers.push(controllerName);

    Object.entries(controllerValues).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        key = this.normalizeKeyName(key);
        value = this.getFormattedValue(value);
        this.attributes[`data-${controllerName}-${key}-value`] = value;
      }
    });

    Object.entries(controllerClasses).forEach(([key, classValue]) => {
      key = this.normalizeKeyName(key);
      this.attributes[`data-${controllerName}-${key}-class`] = classValue;
    });

    Object.entries(controllerOutlets).forEach(([outlet, selector]) => {
      outlet = this.normalizeControllerName(outlet);
      this.attributes[`data-${controllerName}-${outlet}-outlet`] = selector;
    });
  }

  addAction(controllerName, actionName, eventName = null, parameters = {}) {
    controllerName = this.normalizeControllerName(controllerName);
    this.actions.push({
      controllerName,
      actionName,
      eventName,
    });

    Object.entries(parameters).forEach(([name, value]) => {
      const key = this.normalizeKeyName(name);
      this.attributes[`data-${controllerName}-${key}-param`] =
        this.getFormattedValue(value);
    });
  }

  addTarget(controllerName, targetNames = null) {
    if (targetNames !== null && targetNames !== undefined) {
      controllerName = this.normalizeControllerName(controllerName);
      this.targets[`data-${controllerName}-target`] = targetNames;
    }
  }

  addAttribute(name, value) {
    this.attributes[name] = value;
  }

  toString() {
    const controllers = this.controllers.map((controllerName) =>
      this.escapeAsHtmlAttr(controllerName)
    );

    const actions = this.actions.map((actionData) => {
      const controllerName = this.escapeAsHtmlAttr(actionData.controllerName);
      const actionName = this.escapeAsHtmlAttr(actionData.actionName);
      let eventName = actionData.eventName;

      let action = `${controllerName}#${actionName}`;
      if (eventName !== null && eventName !== undefined) {
        eventName = this.escapeAsHtmlAttr(eventName);
        action = `${eventName}->${action}`;
      }

      return action;
    });

    const targets = {};
    Object.entries(this.targets).forEach(([key, targetNamesString]) => {
      const targetNames = targetNamesString.split(" ");
      targets[key] = targetNames
        .map((targetName) => this.escapeAsHtmlAttr(targetName))
        .join(" ");
    });

    const attributes = [];

    if (controllers.length > 0) {
      attributes.push(`data-controller="${controllers.join(" ")}"`);
    }

    if (actions.length > 0) {
      attributes.push(`data-action="${actions.join(" ")}"`);
    }

    if (Object.keys(targets).length > 0) {
      Object.entries(targets).forEach(([key, value]) => {
        attributes.push(`${key}="${value}"`);
      });
    }

    const attributeStrings = Object.entries(this.attributes).map(
      ([key, value]) => {
        return `${key}="${this.escapeAsHtmlAttr(value)}"`;
      }
    );

    return attributes.concat(attributeStrings).join(" ");
  }

  toArray() {
    const actions = this.actions.map((actionData) => {
      const controllerName = actionData.controllerName;
      const actionName = actionData.actionName;
      let eventName = actionData.eventName;

      let action = `${controllerName}#${actionName}`;
      if (eventName !== null && eventName !== undefined) {
        eventName = eventName;
        action = `${eventName}->${action}`;
      }

      return action;
    });

    const attributes = {};

    if (this.controllers.length > 0) {
      attributes["data-controller"] = this.controllers.join(" ");
    }

    if (actions.length > 0) {
      attributes["data-action"] = actions.join(" ");
    }

    Object.entries(this.targets).forEach(([key, value]) => {
      attributes[key] = value;
    });

    return Object.assign(attributes, this.attributes);
  }

  toEscapedArray() {
    const escaped = {};
    Object.entries(this.toArray()).forEach(([key, value]) => {
      escaped[key] = this.escapeAsHtmlAttr(value);
    });

    return escaped;
  }

  getFormattedValue(value) {
    if (
      value instanceof String ||
      (typeof value === "object" && typeof value.toString === "function")
    ) {
      value = value.toString();
    } else if (
      typeof value !== "string" &&
      !(value instanceof Boolean) &&
      !(typeof value === "object" && value !== null)
    ) {
      value = JSON.stringify(value);
    } else if (typeof value === "boolean") {
      value = value ? "true" : "false";
    }

    return value;
  }

  normalizeKeyName(name) {
    return name.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
  }

  normalizeControllerName(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-{2,}/g, "-");
  }

  escapeAsHtmlAttr(value) {
    // return twig.escape("html_attr", value);
    // return escapeHtml(value);
    // return value;
    if (typeof value !== "string") {
      value = String(value);
    }
    return escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
}

export function stimulus_controller(
  controllerName,
  controllerValues = {},
  controllerClasses = {},
  controllerOutlets = {}
) {
  const attributes = new StimulusAttributes(null);
  attributes.addController(
    controllerName,
    controllerValues,
    controllerClasses,
    controllerOutlets
  );
  return attributes.toString();
}

export function stimulus_action(
  controllerName,
  actionName,
  eventName = null,
  parameters = {}
) {
  const attributes = new StimulusAttributes(null);
  attributes.addAction(controllerName, actionName, eventName, parameters);
  return attributes.toString();
}

export function stimulus_target(controllerName, targetNames = null) {
  const attributes = new StimulusAttributes(null);
  attributes.addTarget(controllerName, targetNames);
  return attributes.toString();
}
