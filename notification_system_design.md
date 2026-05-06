# Notification System API Design
## Base URL
```https://campusnotifications.com/```
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
    "targetAudience": "students/faculty/all",
    "scheduledTime": "2024-07-01T10:00:00Z",
    "priority": "high/medium/low",
    "attachments": [
        {
            "type": "image/pdf",
            "url": "https://notification.com/attachment.pdf"
        }
    ]
}

```
- **Response**:         
```json
{
    "success": true,
    "notificationId": "12345",
    "message": "Notification created successfully"
}
``` 
### 2. Get Notifications
- **URL**: `/notifications` 
- **Method**: `GET`
- **Headers**:
  -`Authorization:Bearer <token>`
- **Query Parameters**:
  - `targetAudience`: students/faculty/all
    - `priority`: high/medium/low
    - `scheduledTime`: before/after a specific time
- **Response**:
```json
{
    "success": true,
    "notifications": [
        {
            "notificationId": "12345",
            "title": "New event title",
            "message":"Descriptions about the event", 
            "targetAudience": "students/faculty/all",
            "scheduledTime": "2024-07-01T10:00:00Z",
            "priority": "high/medium/low",
            "attachments": [
                {
                    "type": "image/pdf",
                    "url": "https://notification.com/attachment.pdf"
                }
            ]
        },
        
    ]
}
```
### 3. Update Notification
- **URL**: `/notifications/{notificationId}`
- **Method**: `PUT`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body**:
```json
{
    "title": "Updated event title",
    "message": "Updated description about the event",
    "targetAudience": "students/faculty/all",
    "scheduledTime": "2024-07-01T10:00:00Z",
    "priority": "high/medium/low",
    "attachments": [
        {
            "type": "image/pdf",
            "url": "https://notification.com/updated_attachment.pdf"
        }
    ]
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Notification updated successfully"
}
```
### 4. Delete Notification
- **URL**: `/notifications/{Id}`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
```json
{
    "success": true,
    "message": "Notification deleted successfully"
}
``` 
### 5. Get Notification Details
- **URL**: `/notifications/{notificationId}`   
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
```json
{
    "success": true,
    "notification": {
        "notificationId": "12345",
        "title": "New event title",
        "message":"Descriptions about the event", 
        "targetAudience": "students/faculty/all",
        "scheduledTime": "2024-07-01T10:00:00Z",
        "priority": "high/medium/low",
        "attachments": [
            {
                "type": "image/pdf",
                "url": "https://notification.com/attachment.pdf"
            }
        ]
    }
}
```

# Stage 2:
## Database Choice
For the notification system, I would suggest using a NoSQL database like MongoDB. Here are the reasons for this choice:
1. **Flexibility**: NoSQL databases allow for a flexible schema which is good for a notification system where the structure of notifications can vary 
ex: different types of attachments
2. **Scalability**: NoSQL databases are designed to scale horizontally so it iseasier to handle increasing volumes of data as the number of notifications grows
3. **Performance**: NoSQL databases can provide faster read and write operations for large volumes  
## Database Schema 
### Notifications Collection
```json
{
    "_id": ObjectId,
    "title": String,
    "message": String,
    "targetAudience": String,
    "scheduledTime": Date,
    "priority": String,
    "attachments": [
        {
            "type": String,
            "url": String
        }
    ],
    "createdAt": Date,
    "updatedAt": Date
}
``` 
## Problems with Increasing Data Volume
//very short no comma
1. **Performance Degradation**: As volume of notifications increase query performance may degrade and leading to slow response time
2. **Storage Issues**: Large volumes of data can lead to storage issues if attachments are stored in the database
3. **Backup and Recovery**: Managing backups and recovery can become more complex
## Solution
1. **Indexing**: Create indexes on frequently queried fields to improve query performance
2. **Archiving**: Move old notifications to a separate collection or storage
3. **Cloud Storage**: Store attachments in cloud storage services like AWS S3 and save only the URLs in the database
## Queries
### MongoDB Queries
1. **Create Notification**:
```
db.notifications.insertOne({
    title: "New event title",
    message: "Description about the event",
    targetAudience: "students/faculty/all",
    scheduledTime: new Date("2024-07-01T10:00:00Z"),
    priority: "high/medium/low",
    attachments: [
        {
            type: "image/pdf",
            url: "https://notification.com/attachment.pdf"
        }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
})
```
2. **Get Notifications**:
```db.notifications.find({targetAudience: "students"})
```
3. **Update Notification**:
```db.notifications.updateOne(
    {_id: ObjectId("12345")},
    {
        $set: {
            title: "Updated event title",
            message: "Updated description about the event",
            targetAudience: "students/faculty/all",
            scheduledTime: new Date("2024-07-01T10:00:00Z"),
            priority: "high/medium/low",
            attachments: [
                {
                    type: "image/pdf",
                    url: "https://notification.com/updated_attachment.pdf"
                }
            ],
            updatedAt: new Date()
        }
    }
)
```
4. **Delete Notification**:
```db.notifications.deleteOne({_id: ObjectId("12345")})```
5. **Get Notification Details**:
```db.notifications.findOne({_id: ObjectId("12345")})```

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
# Stage 4
1. **Pagination**: -Instead of loading all notifications at once load a limited number of notifications per page.
2. **Lazy Loading**: Load notifications as the user scrolls down the page so only a subset of notifications is loaded initially and more are loaded as needed
3. **Caching**: Implement caching mechanisms to store frequently accessed notifications in memory to reduce the number of database queries and improve response times.

tradeoffs:
- Pagination and lazy loading can improve performance but may require additional implementation effort and can lead to a less seamless user experience if not implemented properly.

# Stage 5
1. **Scalability Issues**: The current implementation may not scale well as the number of students increases. Sending individual notifications to each student can lead to performance bottlenecks and increased latency.
2. **Resource Intensive**: Sending notifications to a large number of students can consume significant server resources and may lead to timeouts or failures in delivering notifications.
3. **Lack of Personalization**: The current implementation sends the same message to all students without any personalization, which may reduce the effectiveness of the notifications and lead to lower engagement rates.

```python
def notify_all(student_ids: array, message: string):
   
    notification_id = save_to_db(message)
    
    
    notifications = []
    for student_id in student_ids:
        notifications.append({
            "student_id": student_id,
            "notification_id": notification_id,
            "message": message
        })
    

    process_notifications_async(notifications)