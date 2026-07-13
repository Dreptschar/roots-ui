# ActionPlansApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**plantsPlantIdActionPlansGet**](ActionPlansApi.md#plantsplantidactionplansget) | **GET** /plants/{plantId}/action-plans | List action plans for a plant |
| [**plantsPlantIdActionPlansPost**](ActionPlansApi.md#plantsplantidactionplanspost) | **POST** /plants/{plantId}/action-plans | Create an action plan for a plant |



## plantsPlantIdActionPlansGet

> Array&lt;ActionPlanResponse&gt; plantsPlantIdActionPlansGet(plantId)

List action plans for a plant

### Example

```ts
import {
  Configuration,
  ActionPlansApi,
} from '';
import type { PlantsPlantIdActionPlansGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ActionPlansApi();

  const body = {
    // number
    plantId: 789,
  } satisfies PlantsPlantIdActionPlansGetRequest;

  try {
    const data = await api.plantsPlantIdActionPlansGet(body);
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

[**Array&lt;ActionPlanResponse&gt;**](ActionPlanResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Action plan list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## plantsPlantIdActionPlansPost

> ActionPlanResponse plantsPlantIdActionPlansPost(plantId, actionPlanCreateRequest)

Create an action plan for a plant

### Example

```ts
import {
  Configuration,
  ActionPlansApi,
} from '';
import type { PlantsPlantIdActionPlansPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ActionPlansApi();

  const body = {
    // number
    plantId: 789,
    // ActionPlanCreateRequest
    actionPlanCreateRequest: ...,
  } satisfies PlantsPlantIdActionPlansPostRequest;

  try {
    const data = await api.plantsPlantIdActionPlansPost(body);
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
| **actionPlanCreateRequest** | [ActionPlanCreateRequest](ActionPlanCreateRequest.md) |  | |

### Return type

[**ActionPlanResponse**](ActionPlanResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Action plan created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

