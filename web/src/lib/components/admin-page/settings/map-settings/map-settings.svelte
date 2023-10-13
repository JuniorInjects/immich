<script lang="ts">
  import {
    notificationController,
    NotificationType,
  } from '$lib/components/shared-components/notification/notification';
  import { handleError } from '$lib/utils/handle-error';
  import { api, CitiesFile, MapStylesDto, SystemConfigDto } from '@api';
  import { cloneDeep, isEqual } from 'lodash-es';
  import { fade } from 'svelte/transition';
  import SettingAccordion from '../setting-accordion.svelte';
  import SettingButtonsRow from '../setting-buttons-row.svelte';
  import SettingSwitch from '../setting-switch.svelte';
  import SettingSelect from '../setting-select.svelte';
  import TrashCanOutline from 'svelte-material-icons/TrashCanOutline.svelte';
  import Check from 'svelte-material-icons/Check.svelte';
  import SettingInputField, { SettingInputFieldType } from '../setting-input-field.svelte';

  export let config: SystemConfigDto; // this is the config that is being edited
  export let disabled = false;

  let savedConfig: SystemConfigDto;
  let defaultConfig: SystemConfigDto;
  let isEdit = false;
  let newStyle: MapStylesDto = { name: '', url: '' };

  $: lightStyle = newStyle.theme === 'light' ? newStyle : config.map.styles.find((style) => style.theme === 'light');
  $: darkStyle = newStyle.theme === 'dark' ? newStyle : config.map.styles.find((style) => style.theme === 'dark');

  async function refreshConfig() {
    [savedConfig, defaultConfig] = await Promise.all([
      api.systemConfigApi.getConfig().then((res) => res.data),
      api.systemConfigApi.getDefaults().then((res) => res.data),
    ]);
  }

  async function saveSetting() {
    try {
      const { data: current } = await api.systemConfigApi.getConfig();
      const { data: updated } = await api.systemConfigApi.updateConfig({
        systemConfigDto: {
          ...current,
          map: {
            enabled: config.map.enabled,
            styles: config.map.styles,
          },
          reverseGeocoding: {
            enabled: config.reverseGeocoding.enabled,
            citiesFileOverride: config.reverseGeocoding.citiesFileOverride,
          },
        },
      });

      config = cloneDeep(updated);
      savedConfig = cloneDeep(updated);

      notificationController.show({ message: 'Settings saved', type: NotificationType.Info });
    } catch (error) {
      handleError(error, 'Unable to save settings');
    }
  }

  async function addStyle() {
    if (!newStyle.name || !newStyle.url) {
      notificationController.show({ message: 'Name and URL must both be set', type: NotificationType.Error });
      return;
    }

    config.map.styles.push(newStyle);
    await saveSetting();
    isEdit = false;
    newStyle = { name: '', url: '' };
  }

  async function deleteStyle(index: number) {
    config.map.styles.splice(index);
    await saveSetting();
  }

  async function reset() {
    const { data: resetConfig } = await api.systemConfigApi.getConfig();

    config = cloneDeep(resetConfig);
    savedConfig = cloneDeep(resetConfig);

    notificationController.show({
      message: 'Reset settings to the recent saved settings',
      type: NotificationType.Info,
    });
  }

  async function resetToDefault() {
    const { data: configs } = await api.systemConfigApi.getDefaults();

    config = cloneDeep(configs);
    defaultConfig = cloneDeep(configs);

    notificationController.show({
      message: 'Reset map settings to default',
      type: NotificationType.Info,
    });
  }
</script>

<div class="mt-2">
  {#await refreshConfig() then}
    <div in:fade={{ duration: 500 }}>
      <form autocomplete="off" on:submit|preventDefault>
        <div class="flex flex-col gap-4">
          <SettingAccordion title="Map Settings" subtitle="Manage map settings">
            <div class="ml-4 mt-4 flex flex-col gap-4">
              <SettingSwitch
                title="ENABLED"
                {disabled}
                subtitle="Enable map features"
                bind:checked={config.map.enabled}
              />

              <hr />

              <table class="w-full text-left">
                <thead
                  class="mb-4 flex h-12 w-full rounded-md border bg-gray-50 text-immich-primary dark:border-immich-dark-gray dark:bg-immich-dark-gray dark:text-immich-dark-primary"
                >
                  <tr class="flex w-full place-items-center">
                    <th class="w-1/5 text-center text-sm font-medium">Name</th>
                    <th class="w-1/5 text-center text-sm font-medium">URL</th>
                    <th class="w-1/5 text-center text-sm font-medium">Light Default</th>
                    <th class="w-1/5 text-center text-sm font-medium">Dark Default</th>
                    <th class="w-1/5 text-center text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody class="block w-full overflow-y-auto rounded-md border dark:border-immich-dark-gray">
                  {#each config.map.styles as style, i}
                    {#key style.url}
                      <tr
                        class={`flex h-[80px] w-full place-items-center text-center dark:text-immich-dark-fg ${
                          i % 2 == 0
                            ? 'bg-immich-gray dark:bg-immich-dark-gray/75'
                            : 'bg-immich-bg dark:bg-immich-dark-gray/50'
                        }`}
                      >
                        <td class="w-1/5 text-ellipsis px-4 text-sm">{style.name}</td>
                        <td class="w-1/5 text-ellipsis px-4 text-sm">{style.url} </td>
                        <td class="w-1/5 text-ellipsis px-4 text-sm">
                          <SettingSwitch
                            title=""
                            checked={style === lightStyle}
                            on:toggle={(state) => {
                              style.theme = state.detail ? 'light' : undefined;
                              if (state.detail) {
                                config.map.styles.forEach((value) => {
                                  if (value !== style && value.theme === style.theme) {
                                    value.theme = undefined;
                                  }
                                });
                                newStyle.theme = newStyle.theme === 'light' ? undefined : newStyle.theme;
                              }
                            }}
                          />
                        </td>
                        <td class="w-1/5 text-ellipsis px-4 text-sm">
                          <SettingSwitch
                            title=""
                            checked={style === darkStyle}
                            on:toggle={(state) => {
                              style.theme = state.detail ? 'dark' : undefined;
                              if (state.detail) {
                                config.map.styles.forEach((value) => {
                                  if (value !== style && value.theme === style.theme) {
                                    value.theme = undefined;
                                  }
                                });
                                newStyle.theme = newStyle.theme === 'dark' ? undefined : newStyle.theme;
                              }
                            }}
                          />
                        </td>
                        <td class="w-1/5 text-ellipsis px-4 text-sm">
                          <button
                            on:click={() => deleteStyle(i)}
                            class="rounded-full bg-immich-primary p-3 text-gray-100 transition-all duration-150 hover:bg-immich-primary/75 dark:bg-immich-dark-primary dark:text-gray-700"
                          >
                            <TrashCanOutline size="16" />
                          </button>
                        </td>
                      </tr>
                    {/key}
                  {/each}
                  {#if isEdit}
                    <tr
                      class={`flex h-[80px] w-full place-items-center text-center dark:text-immich-dark-fg ${
                        config.map.styles.length % 2 == 0
                          ? 'bg-immich-gray dark:bg-immich-dark-gray/75'
                          : 'bg-immich-bg dark:bg-immich-dark-gray/50'
                      }`}
                    >
                      <td class="w-1/5 text-ellipsis px-4 text-sm"
                        ><SettingInputField
                          inputType={SettingInputFieldType.TEXT}
                          label=""
                          bind:value={newStyle.name}
                        /></td
                      >
                      <td class="w-1/5 text-ellipsis px-4 text-sm">
                        <SettingInputField inputType={SettingInputFieldType.TEXT} label="" bind:value={newStyle.url} />
                      </td>
                      <td class="w-1/5 text-ellipsis px-4 text-sm"
                        ><SettingSwitch
                          title=""
                          checked={newStyle.theme === 'light'}
                          on:toggle={(state) => (newStyle.theme = state.detail ? 'light' : undefined)}
                        /></td
                      >
                      <td class="w-1/5 text-ellipsis px-4 text-sm"
                        ><SettingSwitch
                          title=""
                          checked={newStyle.theme === 'dark'}
                          on:toggle={(state) => (newStyle.theme = state.detail ? 'dark' : undefined)}
                        /></td
                      >
                      <td class="w-1/5 text-ellipsis px-4 text-sm">
                        <button
                          on:click={addStyle}
                          class="rounded-full bg-immich-primary p-3 text-gray-100 transition-all duration-150 hover:bg-immich-primary/75 dark:bg-immich-dark-primary dark:text-gray-700"
                          ><Check size="16" /></button
                        >
                      </td>
                    </tr>
                  {/if}
                </tbody>
              </table>
              <div class="flex justify-end">
                <button
                  on:click={() => {
                    isEdit = !isEdit;
                    newStyle = { name: '', url: '' };
                  }}
                  class="px-4 py-2 text-sm font-medium rounded-full bg-immich-primary p-3 text-gray-100 transition-all duration-150 hover:bg-immich-primary/75 dark:bg-immich-dark-primary dark:text-gray-700"
                  >{isEdit ? 'Cancel' : 'Add'}</button
                >
              </div>

              <!-- <SettingInputField
                inputType={SettingInputFieldType.TEXT}
                label="Tile URL"
                desc="URL to a leaflet compatible tile server"
                bind:value={config.map.tileUrl}
                required={true}
                disabled={disabled || !config.map.enabled}
                isEdited={config.map.tileUrl !== savedConfig.map.tileUrl}
              /> -->
            </div></SettingAccordion
          >

          <SettingAccordion title="Reverse Geocoding Settings">
            <svelte:fragment slot="subtitle">
              <p class="text-sm dark:text-immich-dark-fg">
                Manage <a
                  href="https://immich.app/docs/features/reverse-geocoding"
                  class="underline"
                  target="_blank"
                  rel="noreferrer">Reverse Geocoding</a
                > settings
              </p>
            </svelte:fragment>
            <div class="ml-4 mt-4 flex flex-col gap-4">
              <SettingSwitch
                title="ENABLED"
                {disabled}
                subtitle="Enable reverse geocoding"
                bind:checked={config.reverseGeocoding.enabled}
              />

              <hr />

              <SettingSelect
                label="Precision"
                desc="Set reverse geocoding precision"
                name="reverse-geocoding-precision"
                bind:value={config.reverseGeocoding.citiesFileOverride}
                options={[
                  { value: CitiesFile.Cities500, text: 'Cities with more than 500 people' },
                  { value: CitiesFile.Cities1000, text: 'Cities with more than 1000 people' },
                  { value: CitiesFile.Cities5000, text: 'Cities with more than 5000 people' },
                  { value: CitiesFile.Cities15000, text: 'Cities with more than 15000 people' },
                ]}
                disabled={disabled || !config.reverseGeocoding.enabled}
                isEdited={config.reverseGeocoding.citiesFileOverride !==
                  savedConfig.reverseGeocoding.citiesFileOverride}
              />
            </div></SettingAccordion
          >

          <SettingButtonsRow
            on:reset={reset}
            on:save={saveSetting}
            on:reset-to-default={resetToDefault}
            showResetToDefault={!isEqual(
              { ...savedConfig.map, ...savedConfig.reverseGeocoding },
              { ...defaultConfig.map, ...defaultConfig.reverseGeocoding },
            )}
            {disabled}
          />
        </div>
      </form>
    </div>
  {/await}
</div>
