import {
  stimulus_controller,
  stimulus_action,
  stimulus_target,
} from "stimulus-attributes";
const result = stimulus_controller("my-controller", {
  myValue: "scalar-value",
});

console.log(result);
