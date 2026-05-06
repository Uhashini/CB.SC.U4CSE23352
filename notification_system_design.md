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
```
# Stage 3

-The query is accurate but may be slow due to lack of indexing on the studentID and isRead columns.

-To improve performance add index on the studentID and isRead columns which would reduce the query execution time by allowing the database to quickly locate relevant records.

-Indexing on every column is not effective as it can lead to increased storage requirements and slower write
operations due to the overhead of maintaining multiple indexes. 

-It is best to index only the columns that are frequently used in query conditions.

```sql
SELECT * FROM notifications 
WHERE notificationType = 'Placement' AND createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY);
``` 
