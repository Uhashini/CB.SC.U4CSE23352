//backend developer -campus notification platform
//stage 1 :
//fe dev asked rest api design with json request,response and header structures 
//generate rest api design for notification system with json request,response and header structures with md formatting
# Notification System API Design
## Base URL
```https://api.campusnotifications.com/```
## Endpoints
### 1. Create Notification
- **URL**: `/notifications`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body**:
```json
{
    "title": "New event title",
    "message":"Descriptions about the event", 
}
