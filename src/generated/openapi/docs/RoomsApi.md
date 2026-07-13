# RoomsApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**roomsGet**](RoomsApi.md#roomsget) | **GET** /rooms | List rooms |
| [**roomsPost**](RoomsApi.md#roomspost) | **POST** /rooms | Create a room |
| [**roomsRoomIdDelete**](RoomsApi.md#roomsroomiddelete) | **DELETE** /rooms/{roomId} | Delete a room |
| [**roomsRoomIdGet**](RoomsApi.md#roomsroomidget) | **GET** /rooms/{roomId} | Get a room by id |
| [**roomsRoomIdPatch**](RoomsApi.md#roomsroomidpatch) | **PATCH** /rooms/{roomId} | Update a room |



## roomsGet

> Array&lt;RoomResponse&gt; roomsGet()

List rooms

### Example

```ts
import {
  Configuration,
  RoomsApi,
} from '';
import type { RoomsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RoomsApi();

  try {
    const data = await api.roomsGet();
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

[**Array&lt;RoomResponse&gt;**](RoomResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Room list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## roomsPost

> RoomResponse roomsPost(roomCreateRequest)

Create a room

### Example

```ts
import {
  Configuration,
  RoomsApi,
} from '';
import type { RoomsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RoomsApi();

  const body = {
    // RoomCreateRequest
    roomCreateRequest: ...,
  } satisfies RoomsPostRequest;

  try {
    const data = await api.roomsPost(body);
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
| **roomCreateRequest** | [RoomCreateRequest](RoomCreateRequest.md) |  | |

### Return type

[**RoomResponse**](RoomResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Room created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## roomsRoomIdDelete

> roomsRoomIdDelete(roomId)

Delete a room

### Example

```ts
import {
  Configuration,
  RoomsApi,
} from '';
import type { RoomsRoomIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RoomsApi();

  const body = {
    // number
    roomId: 789,
  } satisfies RoomsRoomIdDeleteRequest;

  try {
    const data = await api.roomsRoomIdDelete(body);
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
| **roomId** | `number` |  | [Defaults to `undefined`] |

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
| **204** | Room deleted |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## roomsRoomIdGet

> RoomResponse roomsRoomIdGet(roomId)

Get a room by id

### Example

```ts
import {
  Configuration,
  RoomsApi,
} from '';
import type { RoomsRoomIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RoomsApi();

  const body = {
    // number
    roomId: 789,
  } satisfies RoomsRoomIdGetRequest;

  try {
    const data = await api.roomsRoomIdGet(body);
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
| **roomId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**RoomResponse**](RoomResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Room |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## roomsRoomIdPatch

> RoomResponse roomsRoomIdPatch(roomId, roomUpdateRequest)

Update a room

### Example

```ts
import {
  Configuration,
  RoomsApi,
} from '';
import type { RoomsRoomIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RoomsApi();

  const body = {
    // number
    roomId: 789,
    // RoomUpdateRequest
    roomUpdateRequest: ...,
  } satisfies RoomsRoomIdPatchRequest;

  try {
    const data = await api.roomsRoomIdPatch(body);
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
| **roomId** | `number` |  | [Defaults to `undefined`] |
| **roomUpdateRequest** | [RoomUpdateRequest](RoomUpdateRequest.md) |  | |

### Return type

[**RoomResponse**](RoomResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Room updated |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

