
# ActionPlanCreateRequest


## Properties

Name | Type
------------ | -------------
`actionTypeId` | number
`intervalDays` | number
`lastPerformedAt` | Date
`active` | boolean
`notes` | string

## Example

```typescript
import type { ActionPlanCreateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "actionTypeId": null,
  "intervalDays": null,
  "lastPerformedAt": null,
  "active": null,
  "notes": null,
} satisfies ActionPlanCreateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActionPlanCreateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


