// test/stimulus.test.js
import { stimulus_controller, stimulus_action, stimulus_target } from "..";

describe("stimulus_controller", () => {
  test("normalize-names", () => {
    const result = stimulus_controller(
      "@symfony/ux-dropzone/dropzone",
      {
        'my"Key"': true,
      },
      {
        'second"Key"': "loading",
      },
      {
        other: ".test",
      },
    );

    expect(result).toBe(
      'data-controller="symfony--ux-dropzone--dropzone" data-symfony--ux-dropzone--dropzone-my-key-value="true" data-symfony--ux-dropzone--dropzone-second-key-class="loading" data-symfony--ux-dropzone--dropzone-other-outlet=".test"',
    );
  });

  test("short-single-controller-no-data", () => {
    const result = stimulus_controller("my-controller");
    expect(result).toBe('data-controller="my-controller"');
  });

  test("short-single-controller-with-data", () => {
    const result = stimulus_controller("my-controller", {
      myValue: "scalar-value",
    });
    expect(result).toBe(
      'data-controller="my-controller" data-my-controller-my-value-value="scalar-value"',
    );
  });

  test("false-attribute-value-renders-false", () => {
    const result = stimulus_controller("false-controller", {
      isEnabled: false,
    });
    expect(result).toBe(
      'data-controller="false-controller" data-false-controller-is-enabled-value="false"',
    );
  });

  test("true-attribute-value-renders-true", () => {
    const result = stimulus_controller("true-controller", {
      isEnabled: true,
    });
    expect(result).toBe(
      'data-controller="true-controller" data-true-controller-is-enabled-value="true"',
    );
  });

  test("null-attribute-value-does-not-render", () => {
    const result = stimulus_controller("null-controller", {
      firstName: null,
    });
    expect(result).toBe('data-controller="null-controller"');
  });

  test("short-single-controller-no-data-with-class", () => {
    const result = stimulus_controller(
      "my-controller",
      {},
      {
        loading: "spinner",
      },
    );
    expect(result).toBe(
      'data-controller="my-controller" data-my-controller-loading-class="spinner"',
    );
  });

  test("short-single-controller-no-data-with-outlet", () => {
    const result = stimulus_controller(
      "my-controller",
      {},
      {},
      {
        "other-controller": ".target",
      },
    );
    expect(result).toBe(
      'data-controller="my-controller" data-my-controller-other-controller-outlet=".target"',
    );
  });

  test("short-single-controller-no-data-with-namespaced-outlet", () => {
    const result = stimulus_controller(
      "my-controller",
      {},
      {},
      {
        "namespaced--other-controller": ".target",
      },
    );
    expect(result).toBe(
      'data-controller="my-controller" data-my-controller-namespaced--other-controller-outlet=".target"',
    );
  });
});

describe("stimulus_action", () => {
  test("with default event", () => {
    const result = stimulus_action("my-controller", "onClick");
    expect(result).toBe('data-action="my-controller#onClick"');
  });

  test("with custom event", () => {
    const result = stimulus_action("my-controller", "onClick", "click");
    expect(result).toBe('data-action="click->my-controller#onClick"');
  });

  test("with parameters", () => {
    const result = stimulus_action("my-controller", "onClick", null, {
      "bool-param": true,
      "int-param": 4,
      "string-param": "test",
    });
    expect(result).toBe(
      'data-action="my-controller#onClick" data-my-controller-bool-param-param="true" data-my-controller-int-param-param="4" data-my-controller-string-param-param="test"',
    );
  });

  test("normalize-name, with default event", () => {
    const result = stimulus_action("@symfony/ux-dropzone/dropzone", "onClick");
    expect(result).toBe('data-action="symfony--ux-dropzone--dropzone#onClick"');
  });

  test("normalize-name, with custom event", () => {
    const result = stimulus_action(
      "@symfony/ux-dropzone/dropzone",
      "onClick",
      "click",
    );
    expect(result).toBe(
      'data-action="click->symfony--ux-dropzone--dropzone#onClick"',
    );
  });

  test("normalize-name, with normalized parameter names", () => {
    const result = stimulus_action("my-controller", "onClick", null, {
      boolParam: true,
      intParam: 4,
      stringParam: "test",
    });
    expect(result).toBe(
      'data-action="my-controller#onClick" data-my-controller-bool-param-param="true" data-my-controller-int-param-param="4" data-my-controller-string-param-param="test"',
    );
  });
});

describe("stimulus_target", () => {
  test("simple", () => {
    const result = stimulus_target("my-controller", "myTarget");
    expect(result).toBe('data-my-controller-target="myTarget"');
  });

  test("normalize-name", () => {
    const result = stimulus_target("@symfony/ux-dropzone/dropzone", "myTarget");
    expect(result).toBe(
      'data-symfony--ux-dropzone--dropzone-target="myTarget"',
    );
  });
});
