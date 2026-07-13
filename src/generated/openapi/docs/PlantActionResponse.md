
# PlantActionResponse


## Properties

Name | Type
------------ | -------------
`id` | number
`plantId` | number
`actionTypeId` | number
`actionPlanId` | number
`performedAt` | Date
`notes` | string

## Example

```typescript
import type { PlantActionResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "plantId": null,
  "actionTypeId": null,
  "actionPlanId": null,
  "performedAt": null,
  "notes": null,
} satisfies PlantActionResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PlantActionResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


