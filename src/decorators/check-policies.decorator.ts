import { SetMetadata } from "@nestjs/common";
import { PolicyHandler } from "src/casl/casl-ability.factory/cast-ability.interface";

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
    SetMetadata(CHECK_POLICIES_KEY, handlers);