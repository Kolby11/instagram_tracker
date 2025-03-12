import type { AppSettingInputCheckboxProps } from '$lib/components/misc/settings/settingsInputCheckbox.svelte';
import type { AppSettingInputNumberProps } from "$lib/components/misc/settings/settingsInputNumber.svelte";

export type AppSettingDataTypes = boolean | number | string;

export enum AppSettingInputTypes{
  CHECKBOX="checkbox",
  NUMBER="number"
}

type ComponentTypePropsMap<T extends AppSettingInputTypes> = T extends AppSettingInputTypes.CHECKBOX
  ? AppSettingInputCheckboxProps
  : T extends AppSettingInputTypes.NUMBER
  ? AppSettingInputNumberProps
  : never;


export type AppSetting<T extends AppSettingDataTypes, I extends AppSettingInputTypes> = {
  title: string;
  tooltip: string;
  value: T;
  defaultValue: T;
  componentType: I;
  componentProps: ComponentTypePropsMap<I>;
};

export type AppSettings = Record<string, AppSetting<AppSettingDataTypes, AppSettingInputTypes>> & {
  automaticDataRefresh: AppSetting<boolean, AppSettingInputTypes.CHECKBOX>;
  refreshInterval: AppSetting<number, AppSettingInputTypes.NUMBER>;
  maxStoredUsers: AppSetting<number, AppSettingInputTypes.NUMBER>;
  maxFetchCount: AppSetting<number, AppSettingInputTypes.NUMBER>;
}