# My Movies App Server
My Movies App is an application to manage your assets. This app has : 
* RESTful endpoint for asset's CRUD operation
* JSON formatted response

&nbsp;

## RESTful endpoints

- Lodging
  - [GET Lodging](#get-lodging)
  - [POST Lodging](#post-lodging)
  - [PUT Lodging](#put-lodgingid)
  - [PATCH Lodging](#patch-lodgingidshow)
  - [DELETE Lodging](#delete-lodgingid)

### GET /lodging

> Get all movies

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": number,
      "name": string,
      "facility": string,
      "roomCapacity": number,
      "imgUrl": string,
      "location": string,
      "price": number,
      "TypeId": number,
      "AuthorId": number,
      "User": {
        "id": number,
        "username": string,
        "email": string,
        "role": string
      },
      "Type": {
        "name": string
      }
    }
  ],
  "pagination": {
    "currentPage": number,
    "totalPages": number,
    "totalItems": number,
    "itemsPerPage": number
  }
}
```

---
### POST /lodging

> Create new lodging
{
  "Authorization": "Bearer <token>"
}
_Request Header_
```
not needed
```

_Request Body_
```
{
  "name": string,
  "facility": string,
  "roomCapacity": number,
  "imgUrl": string,
  "location": string,
  "price": number,
  "TypeId": number
}
```

_Response (201 - Created)_
```
{
  "message": "Lodging <name> added successfully",
  "data": {
    "id": number,
    "name": string,
    "facility": string,
    "roomCapacity": number,
    "imgUrl": string,
    "location": string,
    "price": number,
    "TypeId": number,
    "AuthorId": number
  }
}
```

_Response (400 - Bad Request)_
```
{
  "message": "name is required"
  OR
  "message": "facility is required"
}
```

---
### PUT /lodging/:id

> Update lodging by id
{
  "Authorization": "Bearer <token>"
}
_Request Header_
```
not needed
```

_Request Body_
```
{
  "name": string,
  "facility": string,
  "roomCapacity": number,
  "imgUrl": string,
  "location": string,
  "price": number,
  "TypeId": number
}
```

_Response (201 - Ok)_
```
{
  "message": "Lodging <name> has been updated",
  "data": {
    "id": number,
    "name": string,
    "facility": string,
    "roomCapacity": number,
    "imgUrl": string,
    "location": string,
    "price": number,
    "TypeId": number,
    "AuthorId": number
  }
}
```

_Response (400 - Bad Request)_
```
{
  "message": "title is required"
  OR
  "message": "synopsis is required"
}
```

_Response (404 - Not Found)_
```
{
  "message": "Data not found"
}
```

---
### PATCH /movies/:id/show

> Update movie isNowShowing by id

_Request Header_
```
not needed
```

_Request Body_
```
{
  "isNowShowing": boolean
}
```

_Response (200 - Ok)_
```
{
  "message": "Movie <id> status has been updated to <isNowShowing>"
}
```

_Response (400 - Bad Request)_
```
{
  "message": "isNowShowing is required"
}
```

_Response (404 - Not Found)_
```
{
  "message": "Data not found"
}
```

---
### DELETE /movies/:id

> Remove movie by id
{
  "Authorization": "Bearer <token>"
}
_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200 - Ok)_
```
{
  "message": "Lodging deleted successfully"
}
```
Response (401 - Unauthorized)_
{
  "message": "Invalid token"
}

_Response (400 - Bad Request)_
```
{
  "message": "Validation error message"
}
{
  "message": "Data not found"
}
```

### Global Error


_Response (500 - Internal server error)_
```
{
  "message": "Internal server error"
}
```