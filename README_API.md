# Trip API Documentation

## Trip Leader Handling (Updated)

When creating or updating trips, the frontend should now send trip leader information as a simple string field:

### Simplified Trip Leader Approach

Simply send any text you want to display as the trip leader in the `tripLeader` field:

```json
{
  "title": "Mountain Adventure",
  "description": "Exciting mountain expedition",
  "location": "Alps",
  "duration": "7 days",
  "difficulty": "Medium",
  "price": 1500.0,
  "image": "mountains.jpg",
  "capacity": 15,
  "requiredItems": "Hiking boots, warm clothes",
  "additionalInfo": "Suitable for experienced hikers",
  "tripLeader": "John Smith - Experienced guide with 10+ years in the Alps"
}
```

The backend will:
1. Store this text exactly as provided
2. If no leader text is provided, it will use the creator's name with " (автор)" suffix
3. Display this text directly in the UI

### Response Format

When retrieving trip data, the leader information will be returned in the same format:

```json
{
  "id": 1,
  "title": "Mountain Adventure",
  // other fields...
  "tripLeader": "John Smith - Experienced guide with 10+ years in the Alps"
}
```

## Creating and Updating Trips

- **POST /api/v1/trips** - Create a new trip
- **PUT /api/v1/trips/{id}** - Update an existing trip

Both endpoints accept the trip leader as a simple text field.

## Examples

### Example 1: Simple Name

```json
{
  "tripLeader": "John Smith"
}
```

### Example 2: Name with Title

```json
{
  "tripLeader": "Мария Иванова - Главный гид"
}
```

### Example 3: Detailed Description

```json
{
  "tripLeader": "Алексей Петров, опытный путешественник, покоривший вершины Гималаев"
}
``` 