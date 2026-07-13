# ActionTypesApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actionTypesGet**](ActionTypesApi.md#actiontypesget) | **GET** /action-types | List action types |



## actionTypesGet

> Array&lt;ActionTypeResponse&gt; actionTypesGet()

List action types

### Example

```ts
import {
  Configuration,
  ActionTypesApi,
} from '';
import type { ActionTypesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ActionTypesApi();

  try {
    const data = await api.actionTypesGet();
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

[**Array&lt;ActionTypeResponse&gt;**](ActionTypeResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Action type list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

