# PlantActionsApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**plantsPlantIdActionsGet**](PlantActionsApi.md#plantsplantidactionsget) | **GET** /plants/{plantId}/actions | List actions performed on a plant |
| [**plantsPlantIdActionsPost**](PlantActionsApi.md#plantsplantidactionspost) | **POST** /plants/{plantId}/actions | Record an action for a plant |



## plantsPlantIdActionsGet

> Array&lt;PlantActionResponse&gt; plantsPlantIdActionsGet(plantId)

List actions performed on a plant

### Example

```ts
import {
  Configuration,
  PlantActionsApi,
} from '';
import type { PlantsPlantIdActionsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PlantActionsApi();

  const body = {
    // number
    plantId: 789,
  } satisfies PlantsPlantIdActionsGetRequest;

  try {
    const data = await api.plantsPlantIdActionsGet(body);
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

[**Array&lt;PlantActionResponse&gt;**](PlantActionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Action history |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## plantsPlantIdActionsPost

> PlantActionResponse plantsPlantIdActionsPost(plantId, plantActionCreateRequest)

Record an action for a plant

### Example

```ts
import {
  Configuration,
  PlantActionsApi,
} from '';
import type { PlantsPlantIdActionsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PlantActionsApi();

  const body = {
    // number
    plantId: 789,
    // PlantActionCreateRequest
    plantActionCreateRequest: ...,
  } satisfies PlantsPlantIdActionsPostRequest;

  try {
    const data = await api.plantsPlantIdActionsPost(body);
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
| **plantActionCreateRequest** | [PlantActionCreateRequest](PlantActionCreateRequest.md) |  | |

### Return type

[**PlantActionResponse**](PlantActionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Action recorded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

