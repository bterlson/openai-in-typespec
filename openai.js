import "@typespec/versioning";
import {
    $extension
} from "@typespec/openapi";

import { $added } from "@typespec/versioning";

var map = {};

export function $azureVersion(context, target) {
    map.azureVersion = target;
};

export function $azure(context, target) {
    $added(context, target, map.azureVersion);
    $extension(context, target, "x-ms-azure-openai", true);
}