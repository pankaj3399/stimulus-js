// test/stimulus.test.js
import { stimulus_controller, stimulus_action, stimulus_target } from "..";

test("stimulus_controller should produce correct output", () => {
  const result = stimulus_controller("my-controller", {
    myValue: "scalar-value",
  });
  expect(result).toBe(
    'data-controller="my-controller" data-my-controller-my-value-value="scalar-value"'
  );
});

test("stimulus_action should produce correct output", () => {
  const result = stimulus_action("my-controller", "onClick", null, {
    "bool-param": true,
    "int-param": 4,
    "string-param": "test",
  });
  expect(result).toBe(
    'data-action="my-controller#onClick" data-my-controller-bool-param-param="true" data-my-controller-int-param-param="4" data-my-controller-string-param-param="test"'
  );
});

test("stimulus_target should produce correct output", () => {
  const result = stimulus_target("my-controller", "myTarget");
  expect(result).toBe('data-my-controller-target="myTarget"');
});
