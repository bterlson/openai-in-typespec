import "@typespec/versioning";
import {
    $extension
} from "@typespec/openapi";

import { $added } from "@typespec/versioning";

var state = {};

export function $azureVersion(context, target) {
    state.azureVersion = target;
};

export function $azure(context, target) {
    $added(context, target, state.azureVersion);
    $extension(context, target, "x-ms-azure-openai", true);
}