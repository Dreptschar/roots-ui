# PlantsApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**plantsGet**](PlantsApi.md#plantsget) | **GET** /plants | List plants |
| [**plantsPlantIdDelete**](PlantsApi.md#plantsplantiddelete) | **DELETE** /plants/{plantId} | Delete a plant |
| [**plantsPlantIdGet**](PlantsApi.md#plantsplantidget) | **GET** /plants/{plantId} | Get a plant by id |
| [**plantsPlantIdPatch**](PlantsApi.md#plantsplantidpatch) | **PATCH** /plants/{plantId} | Update a plant |
| [**plantsPost**](PlantsApi.md#plantspost) | **POST** /plants | Create a plant |



## plantsGet

> Array&lt;PlantSummaryResponse&gt; plantsGet()

List plants

### Example

```ts
import {
  Configuration,
  PlantsApi,
} from '';
import type { PlantsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PlantsApi();

  try {
    const data = await api.plantsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;PlantSummaryResponse&gt;**](PlantSummaryResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plant list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## plantsPlantIdDelete

> plantsPlantIdDelete(plantId)

Delete a plant

### Example

```ts
import {
  Configuration,
  PlantsApi,
} from '';
import type { PlantsPlantIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PlantsApi();

  const body = {
    // number
    plantId: 789,
  } satisfies PlantsPlantIdDeleteRequest;

  try {
    const data = await api.plantsPlantIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **plantId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Plant deleted |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## plantsPlantIdGet

> PlantDetailResponse plantsPlantIdGet(plantId)

Get a plant by id

### Example

```ts
import {
  Configuration,
  PlantsApi,
} from '';
import type { PlantsPlantIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PlantsApi();

  const body = {
    // number
    plantId: 789,
  } satisfies PlantsPlantIdGetRequest;

  try {
    const data = await api.plantsPlantIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **plantId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**PlantDetailResponse**](PlantDetailResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plant |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## plantsPlantIdPatch

> PlantDetailResponse plantsPlantIdPatch(plantId, plantUpdateRequest)

Update a plant

### Example

```ts
import {
  Configuration,
  PlantsApi,
} from '';
import type { PlantsPlantIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PlantsApi();

  const body = {
    // number
    plantId: 789,
    // PlantUpdateRequest
    plantUpdateRequest: ...,
  } satisfies PlantsPlantIdPatchRequest;

  try {
    const data = await api.plantsPlantIdPatch(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **plantId** | `number` |  | [Defaults to `undefined`] |
| **plantUpdateRequest** | [PlantUpdateRequest](PlantUpdateRequest.md) |  | |

### Return type

[**PlantDetailResponse**](PlantDetailResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plant updated |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## plantsPost

> PlantDetailResponse plantsPost(plantCreateRequest)

Create a plant

### Example

```ts
import {
  Configuration,
  PlantsApi,
} from '';
import type { PlantsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PlantsApi();

  const body = {
    // PlantCreateRequest
    plantCreateRequest: ...,
  } satisfies PlantsPostRequest;

  try {
    const data = await api.plantsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **plantCreateRequest** | [PlantCreateRequest](PlantCreateRequest.md) |  | |

### Return type

[**PlantDetailResponse**](PlantDetailResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Plant created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

