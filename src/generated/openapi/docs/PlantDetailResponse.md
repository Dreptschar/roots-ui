
# PlantDetailResponse


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`species` | string
`roomId` | number
`notes` | string
`photoPath` | string
`createdAt` | Date
`updatedAt` | Date
`room` | [RoomResponse](RoomResponse.md)
`actionPlans` | [Array&lt;ActionPlanResponse&gt;](ActionPlanResponse.md)
`actions` | [Array&lt;PlantActionResponse&gt;](PlantActionResponse.md)

## Example

```typescript
import type { PlantDetailResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "species": null,
  "roomId": null,
  "notes": null,
  "photoPath": null,
  "createdAt": null,
  "updatedAt": null,
  "room": null,
  "actionPlans": null,
  "actions": null,
} satisfies PlantDetailResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PlantDetailResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


