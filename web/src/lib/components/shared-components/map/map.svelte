<script lang="ts">
  import {
    MapLibre,
    GeoJSON,
    MarkerLayer,
    AttributionControl,
    ControlButton,
    Control,
    ControlGroup,
  } from 'svelte-maplibre';
  import { colorTheme } from '$lib/stores/preferences.store';
  import { serverConfig } from '$lib/stores/server-config.store';
  import { MapMarkerResponseDto, api } from '@api';
  import { onMount } from 'svelte';
  import Cog from 'svelte-material-icons/Cog.svelte';
  import type { LngLatLike } from 'maplibre-gl';

  export let mapMarkers: MapMarkerResponseDto[];
  export let showSettingsModal: boolean | undefined = undefined;
  export let zoom: number | undefined = undefined;
  export let center: LngLatLike | undefined = undefined;

  let styleUrl: string;

  onMount(() => {
    colorTheme.subscribe(handleModeSwitch);
  });

  async function handleModeSwitch(mode: 'dark' | 'light') {
    switch (mode) {
      case 'dark':
        styleUrl = getDarkStyle();
        break;
      case 'light':
        styleUrl = getLightStyle();
        break;
    }
  }

  function getLightStyle() {
    return $serverConfig.mapStyles.find((style) => style.theme === 'light')?.url || styleUrl;
  }

  function getDarkStyle() {
    return $serverConfig.mapStyles.find((style) => style.theme === 'dark')?.url || styleUrl;
  }
</script>

<MapLibre style={styleUrl} class="h-full" {center} {zoom} standardControls attributionControl={false}>
  <AttributionControl compact={false} customAttribution={'Thanks to Cofractal for providing their tile servers!'} />
  {#if showSettingsModal !== undefined}
    <Control>
      <ControlGroup>
        <ControlButton on:click={() => (showSettingsModal = true)}><Cog size="100%" /></ControlButton>
      </ControlGroup>
    </Control>
  {/if}
  <GeoJSON
    data={{
      type: 'FeatureCollection',
      features: mapMarkers.map((marker) => {
        // This should be done on the server
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [marker.lon, marker.lat] },
          properties: {
            id: marker.id,
          },
        };
      }),
    }}
    cluster={{ maxZoom: 14, radius: 500 }}
  >
    <MarkerLayer applyToClusters interactive let:feature>
      <div class="rounded-full w-[40px] h-[40px] bg-blue-200 flex justify-center items-center">
        {feature.properties?.point_count}
      </div>
    </MarkerLayer>
    <MarkerLayer applyToClusters={false} let:feature>
      <img
        src={api.getAssetFileUrl(feature.properties?.id)}
        class="rounded-full w-[60px] h-[60px]"
        alt={`Image with id ${feature.properties?.id}`}
      />
    </MarkerLayer>
  </GeoJSON>
  <!-- {#each mapMarkers as { id, lat, lon }}
    <Marker
      lngLat={{ lng: lon, lat }}
      class="w-[60px] h-[60px] flex justify-center items-center"
      on:click={() => assetViewingStore.setAssetId(id)}
    >
      <img src={api.getAssetFileUrl(id)} class="rounded-full w-[60px] h-[60px]" />
    </Marker>
  {/each} -->
</MapLibre>
