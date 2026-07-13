
# PlantSummaryResponse


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

## Example

```typescript
import type { PlantSummaryResponse } from ''

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
} satisfies PlantSummaryResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PlantSummaryResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


